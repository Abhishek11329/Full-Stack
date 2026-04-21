package com.hospital.backend.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    @Async
    public void simulateSendingEmail(String to, String subject, String body) {
        try {
            // Simulate network delay
            Thread.sleep(1000);
            
            logger.info("\n=======================================================");
            logger.info("EMAIL SIMULATION TRIGGERED");
            logger.info("To: " + to);
            logger.info("Subject: " + subject);
            logger.info("Body:\n" + body);
            logger.info("=======================================================\n");
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
