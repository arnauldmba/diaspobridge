package com.diasporabridge.backend.services;

import java.security.Principal;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.entities.User.Role;
import com.diasporabridge.backend.register.VerificationToken;
import com.diasporabridge.backend.register.VerificationTokenRepository;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.services.exception.EmailAlreadyExistsException;
import com.diasporabridge.backend.services.exception.ExpiredTokenException;
import com.diasporabridge.backend.services.exception.InvalidTokenException;
import com.diasporabridge.backend.util.EmailSender;

import DTO.RegistrationRequest;

@Service
public class UserServiceImpl implements UserService{
	@Autowired
	UsersRepository usersRepository;
	
	@Autowired
	VerificationTokenRepository verificationTokenRepo;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder; 
	
	@Autowired
	EmailSender emailSender; 

	@Override
	public User saveUser(User user) {
		//user.setPasswordHash(bCryptPasswordEncoder.encode(user.getPasswordHash()));
		return usersRepository.save(user);
	}
	
	@Override
	public User updateUserProfile(Long id, User incomingUser) {
	    User user = usersRepository.findActiveById(id)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    // logique de mise à jour
	    user.setFirstName(incomingUser.getFirstName());
	    user.setLastName(incomingUser.getLastName());
	    user.setPhone(incomingUser.getPhone());
	    // éventuellement d'autres champs autorisés

	    return usersRepository.save(user);
	}

	@Override
	public User updateUser(User user) {
		
		return usersRepository.save(user);
	}

	@Override
	public void deleteUser(User user) {
		usersRepository.delete(user);
	}

	@Override
	public void deleteUserById(Long id) {
		usersRepository.deleteById(id);
	}

	@Override
	public Optional<User> findByEmail(String email) {
		return usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(email);
	}

	@Override
	public boolean existsByEmail(String email) {
		return usersRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(email);
	}

	@Override
	public User findByFirstName(String firstName) {
		return usersRepository.findByfirstName(firstName);
	}

	@Override
	public Optional<User> findActiveByEmailIgnoreCase(String email) {
		return usersRepository.findActiveByEmailIgnoreCase(email);
	}

	@Override
	public boolean existsActiveByEmailIgnoreCase(String email) {
		return false;
	}

	@Override
	public Optional<User> findActiveById(Long id) {
		return usersRepository.findActiveById(id);
	}

	
	@Override
	public List<User> getAllActiveUsers() {
		return usersRepository.findByIsActiveTrue();
	}
	
	@Override
	public User addRoleToUser(String email, User.Role roleName) {
	    User user = findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable: " + email));

	    user.setRole(roleName);
	    return usersRepository.save(user);
	}
	
	/**
	 * Methode pour verifier que l'utilisateur qui est entrain de creer son compte
	 * na pas les memes inforamtion qu'un utilisateur deja present dans la BD
	 */
	@Override
	public User registerUser(RegistrationRequest request) {
		Optional<User> optionalUser = usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(request.getEmail());
		if(optionalUser.isPresent()) {throw new EmailAlreadyExistsException("Email deja existant! ");}
		
		User newUser = new User();
		newUser.setFirstName(request.getFirstName());
		newUser.setEmail(request.getEmail());
		newUser.setPasswordHash(bCryptPasswordEncoder.encode(request.getPassword()));
		newUser.setIsActive(false);
		newUser.setEmailVerified(false);
		
		// Persist user first (obtient un ID)
	    User savedUser = usersRepository.save(newUser);
		
	    // créer et sauver le token lié à un user persisté
		String code = this.generateCode(); 
		VerificationToken token = new VerificationToken(code, savedUser);
		verificationTokenRepo.save(token);
		
		// envoyer le code par email a l'utilisateur 
		sendEmailUser(savedUser, token.getToken());
		
		return savedUser;
	}

	private String generateCode() {
		Random random = new Random();
		Integer code = 100000 + random.nextInt(900000);
		return code.toString();
	}

	@Override
	public void sendEmailUser(User user, String code) {
		String emailBody = 
				"Bonjour " + "<h1>"+ user.getFirstName() + 
				"</h1>" + " Votre code de validation est "+"<h1>"+ code + "</h1>"+ "\n\n" +
						  "Ce code expire dans 15 minutes.";
		
		  emailSender.sendEmail(user.getEmail(), emailBody);
	}

	@Override
	public User validateToken(String code) {
		
		VerificationToken token = verificationTokenRepo.findByToken(code);
		if(token == null){
			throw new InvalidTokenException("Invalid Token");
		}

		User user = token.getUser();
		Calendar calendar = Calendar.getInstance();
		
		if ((token.getExpirationTime().getTime() - calendar.getTime().getTime()) <= 0){
			verificationTokenRepo.delete(token);
			throw new ExpiredTokenException("expired Token");
		}
		
		user.setIsActive(true);
		user.setEmailVerified(true);
		
		usersRepository.save(user);
		verificationTokenRepo.delete(token); // supprime le token appes validatio
		
		return user;
	}

	@Override
	public User currentUser(Principal principal) {
        String email = principal.getName();
        return usersRepository.findActiveByEmailIgnoreCase(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
	
	@Override
	public void resendVerificationToken(String email) {

	    if (email == null || email.trim().isEmpty()) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
	    }

	    Optional<User> optUser = usersRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(email.trim());

	    // ✅ Ne pas révéler si l'email existe ou non
	    if (optUser.isEmpty()) {
	        return; 
	    }

	    User user = optUser.get();

	    // déjà vérifié → rien à faire
	    if (Boolean.TRUE.equals(user.getEmailVerified())) {
	        return;
	    }

	    // récupérer token existant (si tu as 1 token par user)
	    Optional<VerificationToken> optToken =
	            verificationTokenRepo.findByUserId(user.getId());

	    if (optToken.isPresent()) {
	        VerificationToken token = optToken.get();

	        // si le token n’est pas expiré → renvoyer
	        if (token.getExpirationTime().after(new Date())) {
	            sendEmailUser(user, token.getToken());
	            return;
	        }

	        // sinon token expiré → supprimer
	        verificationTokenRepo.delete(token);
	    }

	    // créer un nouveau token
	    String code = generateCode();
	    VerificationToken newToken = new VerificationToken(code, user);
	    verificationTokenRepo.save(newToken);

	    sendEmailUser(user, code);
	}

	

}
