package com.doacaobebe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/table-structure")
    public List<String> getTableStructure() {
        List<String> columns = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            ResultSet rs = metaData.getColumns(null, null, "Usuario", null);
            
            while (rs.next()) {
                String columnName = rs.getString("COLUMN_NAME");
                String dataType = rs.getString("TYPE_NAME");
                columns.add(columnName + " (" + dataType + ")");
            }
        } catch (Exception e) {
            columns.add("Erro: " + e.getMessage());
        }
        return columns;
    }
}