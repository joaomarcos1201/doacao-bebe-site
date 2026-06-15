package com.doacaobebe.dto;

public class MercadoPagoWebhookRequest {
    private String action;
    private String type;
    private DataWrapper data;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public DataWrapper getData() { return data; }
    public void setData(DataWrapper data) { this.data = data; }

    public static class DataWrapper {
        private String id;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
    }
}
