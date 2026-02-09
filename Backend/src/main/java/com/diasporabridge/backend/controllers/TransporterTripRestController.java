package com.diasporabridge.backend.controllers;


import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.TransporterTripRepository;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.services.TransporterTripService;
import org.springframework.security.core.Authentication;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trip")
@CrossOrigin
@RequiredArgsConstructor
public class TransporterTripRestController {
	
	private final TransporterTripService transporterTripService; 
    private final UsersRepository userRepository;
    private final TransporterTripRepository tripRepository;

    
	@GetMapping
	List <TransporterTrip> getAllTransporterTrip(){
		return this.transporterTripService.getAllVisibleTrips();
	}
	
	// recuperer un trip par ID
    @GetMapping("/{id}")
    public TransporterTrip getTripById(@PathVariable Long id) {
        return transporterTripService.getTransporterTripById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found: " + id));
    }
    

    @PostMapping
    public ResponseEntity<TransporterTrip> createTrip(@RequestBody TransporterTrip trip, Principal principal) {
    	    	
        // principal.getName() = email de l'utilisateur connecté (normalement)
        String email = principal.getName();

        User me = userRepository
                .findActiveByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));


        TransporterTrip saved = transporterTripService.createTrip(trip, me);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/my")
    public List<TransporterTrip> getMyTrips(Principal principal) {
    	
    	if(principal == null) {
    		throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    	}

        String email = principal.getName();

        User transporter = userRepository
                .findActiveByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return tripRepository.findByTransporter(transporter);
    }
    
    // Nouvelle methode 
    @PutMapping("/{id}")
    public TransporterTrip updateTrip(@PathVariable Long id, @RequestBody TransporterTrip payload,
                                      Principal principal) {

    	User me = userRepository.findActiveByEmailIgnoreCase(principal.getName())
    	        .orElseThrow(() -> new RuntimeException("User not found"));

    	    return transporterTripService.updateTransporterTrip(id, payload, me);
    }
    
    
    // Supprimer un trip par ID nouvelle methode
    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id, Principal principal) {

        User me = userRepository.findActiveByEmailIgnoreCase(principal.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

            transporterTripService.deleteTransporterTripById(id, me);
    }
    
    
    // Récupérer tous les trips actifs
    @GetMapping("/active")
    public List<TransporterTrip> getAllActiveTrips() {
        return transporterTripService.getActiveTrips();
    }
    
    // Filtrer les trips par origine, destination, dates
    @GetMapping("/search")
    public Page<TransporterTrip> searchTrips(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String dest,
            
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            
            @RequestParam(defaultValue = "true") boolean activeOnly,
            Pageable pageable) {
    	
    	// ✅ Trim (optionnel mais recommandé)
        origin = normalize(origin);
        dest = normalize(dest);
        
     // ✅ règle: si une seule date est fournie -> recherche exacte ce jour-là
        if (fromDate != null && toDate == null) {
            toDate = fromDate;
        } else if (fromDate == null && toDate != null) {
            fromDate = toDate;
        }

        // ✅ optionnel: si l'utilisateur inverse les dates, on swap
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            LocalDate tmp = fromDate;
            fromDate = toDate;
            toDate = tmp;
        }
        
        return transporterTripService.searchTrips(origin, dest, fromDate, toDate, activeOnly, pageable);
    }
    
    private String normalize(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
    
    @GetMapping("/search/country")
    public Page<TransporterTrip> searchTripsByContry(
    		@RequestParam(required = false) String origin,
            @RequestParam(required = false) String dest,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            Pageable pageable) {
        return transporterTripService.searchTripsByCountry(origin, dest, activeOnly, pageable);
    }
}
