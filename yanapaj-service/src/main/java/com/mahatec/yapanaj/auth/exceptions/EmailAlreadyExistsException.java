package com.mahatec.yapanaj.auth.exceptions;

public class EmailAlreadyExistsException extends IllegalArgumentException {

    private static final String DEFAULT_MESSAGE = "Email already exists";

    private EmailAlreadyExistsException(final String message) {
        super(message);
    }

    public static EmailAlreadyExistsException create() {
        return new EmailAlreadyExistsException(DEFAULT_MESSAGE);
    }
}
