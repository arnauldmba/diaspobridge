package com.diasporabridge.backend.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import java.math.BigDecimal;
import org.springframework.util.StringUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.TransporterTripRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransporterTripServiceImpl implements TransporterTripService {
	
	//@Autowired 
	private final TransporterTripRepository transporterTripRepository;
	
	public TransporterTrip createTrip(TransporterTrip payload, User me) {
	    validateTripPayload(payload);

	    payload.setId(null);                 // évite overwrite
	    payload.setTransporter(me);          // FORCE owner
	    // payload.setIsActive(true);        // optionnel

	    return transporterTripRepository.save(payload);
	}

	@Override
	public TransporterTrip saveTransporterTrip(TransporterTrip transporterTrip) {
		validateTripPayload(transporterTrip);
		return transporterTripRepository.save(transporterTrip);
	}

	@Override
	public TransporterTrip updateTransporterTrip(Long id, TransporterTrip payload, User me) {
		
		validateTripPayload(payload);
		
		TransporterTrip existing = transporterTripRepository.findById(id)
		        //.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        		.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));


	    if (!existing.getTransporter().getId().equals(me.getId())) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
	    }
	    
	    existing.setOriginCity(payload.getOriginCity());
	    existing.setOriginCountry(payload.getOriginCountry());
	    existing.setDestCity(payload.getDestCity());
	    existing.setDestCountry(payload.getDestCountry());
	    existing.setPricePerKg(payload.getPricePerKg());
	    existing.setDepartDate(payload.getDepartDate());
	    existing.setMaxWeightKg(payload.getMaxWeightKg());
	    existing.setAcceptedTypes(payload.getAcceptedTypes());
	    existing.setNote(payload.getNote());

		    
		return transporterTripRepository.save(existing);
	}

	@Override
	public void deleteTransporterTrip(TransporterTrip transporterTrip) {
		transporterTripRepository.delete(transporterTrip);
	}

	@Override
	public void deleteTransporterTripById(Long id, User me) {

	    TransporterTrip existing = transporterTripRepository.findById(id)
	        //.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        	.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));


	    if (!existing.getTransporter().getId().equals(me.getId())) {
	        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed");
	    }

	    transporterTripRepository.delete(existing);
	}

	@Override
	public List<TransporterTrip> getAllTransporterTrip() {
		return transporterTripRepository.findAll();
	}
	
	@Override
	public List<TransporterTrip> getActiveTrips() {
	    return transporterTripRepository.findByIsActiveTrue(Pageable.unpaged()).getContent();
	}

	@Override
	public Page<TransporterTrip> searchTrips(String origin, String dest, LocalDate fromDate, LocalDate toDate,
			boolean activeOnly, Pageable pageable) {
		return transporterTripRepository.searchTrips(origin, dest, fromDate, toDate, activeOnly, pageable);
	}
	
	@Override
	public Optional<TransporterTrip> getTransporterTripById(Long id) {
	    return transporterTripRepository.findById(id);
	}

	@Override
	public Page<TransporterTrip> searchTripsByCountry(String origin, String dest, boolean activeOnly,
			Pageable pageable) {
		// TODO Auto-generated method stub
		return transporterTripRepository.searchTripsByCountry(origin, dest, activeOnly, pageable);
	}

	@Override
	public List<TransporterTrip> getAllVisibleTrips() {
	    return transporterTripRepository.findAllVisibleTrips();
	}
	
	private void validateTripPayload(TransporterTrip p) {

	    if (p == null) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payload missing");
	    }

	    // Normalisation (trim)
	    p.setOriginCity(p.getOriginCity() != null ? p.getOriginCity().trim() : null);
	    p.setOriginCountry(p.getOriginCountry() != null ? p.getOriginCountry().trim() : null);
	    p.setDestCity(p.getDestCity() != null ? p.getDestCity().trim() : null);
	    p.setDestCountry(p.getDestCountry() != null ? p.getDestCountry().trim() : null);
	    p.setAcceptedTypes(p.getAcceptedTypes() != null ? p.getAcceptedTypes().trim() : null);
	    p.setNote(p.getNote() != null ? p.getNote().trim() : null);

	    // Champs obligatoires
	    if (!StringUtils.hasText(p.getOriginCity())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "originCity is required");
	    }
	    if (!StringUtils.hasText(p.getOriginCountry())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "originCountry is required");
	    }
	    if (!StringUtils.hasText(p.getDestCity())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "destCity is required");
	    }
	    if (!StringUtils.hasText(p.getDestCountry())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "destCountry is required");
	    }

	    // Dates
	    if (p.getDepartDate() == null) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "departDate is required");
	    }
	    if (p.getDepartDate().isBefore(LocalDate.now())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "departDate cannot be in the past");
	    }

	    // Poids
	    if (p.getMaxWeightKg() == null) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "maxWeightKg is required");
	    }
	    if (p.getMaxWeightKg().compareTo(BigDecimal.ZERO) <= 0) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "maxWeightKg must be > 0");
	    }
	    
	    // price
	    if (p.getPricePerKg() == null) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pricePerKilo is required");
	    }
	    if (p.getPricePerKg().compareTo(BigDecimal.ZERO) <= 0) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "maxWeightKg must be > 0");
	    }

	    // Longueurs max (évite erreurs SQL)
	    if (p.getAcceptedTypes() != null && p.getAcceptedTypes().length() > 100) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "acceptedTypes too long");
	    }
	    if (p.getNote() != null && p.getNote().length() > 500) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "note too long");
	    }

	    // Logique métier : origine != destination
	    if (p.getOriginCity().equalsIgnoreCase(p.getDestCity())
	            && p.getOriginCountry().equalsIgnoreCase(p.getDestCountry())) {
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "origin and destination cannot be the same");
	    }
	}

	@Override
	public Page<TransporterTrip> searchTripsByCity(String origin, String dest, boolean activeOnly, Pageable pageable) {
		return null;
	}



}
