package com.luv2code.springboot.cruddemo.dto;

public class CustomerDTO extends UserBaseDTO {

    private String imageUrl;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}