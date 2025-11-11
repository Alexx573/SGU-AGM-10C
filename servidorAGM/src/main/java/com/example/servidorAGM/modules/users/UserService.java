package com.example.servidorAGM.modules.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired // Inyecta una instancia de UserRepository
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Crear un nuevo usuario
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Actualizar un usuario existente
    public User updateUser(Long id, User userDetails) {
        // Verifica si el usuario existe antes de actualizar
        return userRepository.findById(id)
                .map(user -> {
                    user.setFullName(userDetails.getFullName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhoneNumber(userDetails.getPhoneNumber());
                    return userRepository.save(user); // Guarda el usuario actualizado
                })
                .orElse(null); // O maneja la excepción de otra manera si el usuario no existe
    }

    // Eliminar un usuario
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
