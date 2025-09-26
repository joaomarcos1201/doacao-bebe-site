package com.doacaobebe.dto;

public class AdminRequest {
    private Boolean isAdmin;

    public AdminRequest() {}

    public AdminRequest(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }
}