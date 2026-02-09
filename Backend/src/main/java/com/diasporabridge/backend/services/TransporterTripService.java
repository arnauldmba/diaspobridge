package com.diasporabridge.backend.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;

public interface TransporterTripService {
	public TransporterTrip saveTransporterTrip(TransporterTrip transporterTrip);
	public TransporterTrip createTrip(TransporterTrip payload, User me);
	public TransporterTrip updateTransporterTrip(Long id, TransporterTrip payload, User me);
	void deleteTransporterTrip(TransporterTrip transporterTrip);
	void deleteTransporterTripById(Long id, User me);
	List <TransporterTrip> getAllTransporterTrip();
	
	//public TransporterTrip getTransporterTripById(Long id);
	
	Optional<TransporterTrip> getTransporterTripById(Long id);
	
	public List<TransporterTrip> getActiveTrips();
	
	public Page<TransporterTrip> searchTrips(
			String origin, 
			String dest, 
			LocalDate fromDate, 
			LocalDate toDate,
			boolean activeOnly, 
			Pageable pageable
	);
	
	public Page<TransporterTrip> searchTripsByCountry(
			String origin, 
			String dest,
			boolean activeOnly, 
			Pageable pageable
	);
	
	public Page<TransporterTrip> searchTripsByCity(
			String origin, 
			String dest,
			boolean activeOnly, 
			Pageable pageable
	);
	
	public List<TransporterTrip> getAllVisibleTrips();
}
