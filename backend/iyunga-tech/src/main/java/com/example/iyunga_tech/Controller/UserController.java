package com.example.iyunga_tech.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import com.example.iyunga_tech.Entity.User;
import com.example.iyunga_tech.Repository.UserRepository;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/students")
public class UserController {

    private final UserRepository userRepo;

    // dependency injection - consructor injection
    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
    // inserting new students

    @PostMapping
    // method to add a new student
    public User addStudent(@RequestBody User user) {
        return userRepo.save(user);
    }

    @GetMapping
    public List<User> getAllStudents() {
        return userRepo.findAll();
    }

    @GetMapping("/{id}")
    public User getSingleStudentById(@PathVariable Long id) {
        // finding if a student with that id is present
        User existingUser = userRepo.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student with ID:" + id + " is not found!!"));
        return existingUser;
    }

    @PutMapping("/{id}")
    public User updateStudent(@PathVariable Long id, @RequestBody User user) {
        User existing = userRepo.findById(id).orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        existing.setFirstName(user.getFirstName());
        existing.setSecondName(user.getSecondName());
        existing.setEmail(user.getEmail());
        existing.setLevel(user.getLevel());

        return userRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        // finding if the specified id is present on the database
        boolean existing = userRepo.existsById(id);

        if (!existing) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student with ID:" + id + " is not found!!");
        }
        userRepo.deleteById(id);
    }
}