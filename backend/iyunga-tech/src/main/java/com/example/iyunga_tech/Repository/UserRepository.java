package com.example.iyunga_tech.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.iyunga_tech.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}