package com.huseyn.mebelsayti.repository;

import com.huseyn.mebelsayti.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
