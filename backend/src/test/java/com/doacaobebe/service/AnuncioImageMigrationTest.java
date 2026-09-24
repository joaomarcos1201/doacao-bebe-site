package com.doacaobebe.service;

import com.doacaobebe.tools.OptimizeAnuncioImages;
import org.junit.jupiter.api.Test;
import java.sql.*;
import java.io.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class AnuncioImageMigrationTest {
    @Test void dryRunRollbackAndApplyWithRealTransactions() throws Exception {
        try(var db=DriverManager.getConnection("jdbc:h2:mem:"+UUID.randomUUID()+";MODE=MSSQLServer")) {
            db.createStatement().execute("CREATE TABLE Anuncio(id INT PRIMARY KEY, nome VARCHAR(50), foto VARBINARY, foto2 VARBINARY, foto3 VARBINARY, foto4 VARBINARY)");
            byte[] original=AnuncioImageOptimizerTest.bytes(AnuncioImageOptimizerTest.fixture(2000,1000,false),"jpeg");
            try(var insert=db.prepareStatement("INSERT INTO Anuncio(id,nome,foto,foto2) VALUES(?,'inalterado',?,?)")) {
                for(int id:new int[]{62,65}) { insert.setInt(1,id);insert.setBytes(2,original);
                    insert.setBytes(3,id==62?original:"corrupt".getBytes());insert.executeUpdate(); }
            }
            var output=new ByteArrayOutputStream(); var log=new PrintStream(output);
            OptimizeAnuncioImages.run(db,List.of(),false,new AnuncioImageOptimizer(),log);
            assertArrayEquals(original,photo(db,62));
            OptimizeAnuncioImages.run(db,List.of(),true,new AnuncioImageOptimizer(),log);
            assertTrue(photo(db,62).length<original.length);
            assertArrayEquals(original,photo(db,65),"Failure in foto2 must preserve foto");
            assertTrue(output.toString().contains("SIMULACAO"));
            assertTrue(output.toString().contains("ERRO_MANTIDA"));
            assertTrue(output.toString().contains("GRAVADA"));
            byte[] optimized=photo(db,62);
            OptimizeAnuncioImages.run(db,List.of(62),true,new AnuncioImageOptimizer(),log);
            assertArrayEquals(optimized,photo(db,62));
            // Force the second UPDATE to fail: the first photo update must roll back.
            db.createStatement().execute("DELETE FROM Anuncio");
            try(var insert=db.prepareStatement("INSERT INTO Anuncio(id,nome,foto,foto2) VALUES(62,'inalterado',?,?)")) {
                insert.setBytes(1,original);insert.setBytes(2,original);insert.executeUpdate();
            }
            db.createStatement().execute("ALTER TABLE Anuncio ADD CONSTRAINT keep_second CHECK (OCTET_LENGTH(foto2)="+original.length+")");
            OptimizeAnuncioImages.run(db,List.of(62),true,new AnuncioImageOptimizer(),log);
            assertArrayEquals(original,photo(db,62));
            assertTrue(db.getAutoCommit());
            try(var row=db.createStatement().executeQuery("SELECT nome FROM Anuncio WHERE id=62")) {
                assertTrue(row.next());assertEquals("inalterado",row.getString(1));
            }
        }
    }
    private byte[] photo(Connection db,int id) throws Exception {
        try(var query=db.prepareStatement("SELECT foto FROM Anuncio WHERE id=?")) {
            query.setInt(1,id);try(var rows=query.executeQuery()){ assertTrue(rows.next()); return rows.getBytes(1); }
        }
    }
}
