package com.sayan.motowrapbackend.bike;

public class BikeRequest {
    public String nickname;
    public String make;
    public String model;
    public Integer year;
    public Integer engineCC;
    public String color;
    public String licensePlate;

    public String getNickname() { return nickname; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public Integer getEngineCC() { return engineCC; }
    public String getColor() { return color; }
    public String getLicensePlate() { return licensePlate; }
}
