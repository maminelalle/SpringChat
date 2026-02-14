package com.chat.config;

import com.chat.model.ChatRoom;
import com.chat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (chatRoomRepository.count() == 0) {
            chatRoomRepository.save(new ChatRoom("Général", "public"));
        }
    }
}
