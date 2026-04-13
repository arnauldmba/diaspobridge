package com.diasporabridge.backend.services;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

import com.diasporabridge.backend.user.entity.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;
import com.diasporabridge.backend.repos.ParcelRequestRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.repos.admin.AdminTripReadRepository;
import com.diasporabridge.backend.repos.admin.AdminUserReadRepository;
import com.diasporabridge.backend.trip.entity.TransporterTrip;

import DTO.AdminDashboardStatsDTO;
import DTO.AdminTripRowDTO;
import DTO.AdminUserRowDTO;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UsersRepository userRepository;
    private final TransporterTripRepository transporterTripRepository;
    private final ParcelRequestRepository parcelRequestRepository;
    private final MatchRepository matchRepository;
    private final MessageRepository messageRepository;

    private final AdminUserReadRepository adminUserReadRepository;
    private final AdminTripReadRepository adminTripReadRepository;


    public AdminDashboardStatsDTO getDashboardStats() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalListings(transporterTripRepository.count());
        stats.setTotalParcelRequests(parcelRequestRepository.count());
        stats.setTotalMatches(matchRepository.count());
        stats.setTotalMessages(messageRepository.count());

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void blockUser(Long userId) {
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow();

        user.setBlocked(true);
        userRepository.save(user);
    }

    public void unblockUser(Long userId) {
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow();

        user.setBlocked(false);
        userRepository.save(user);
    }

    public List<TransporterTrip> getAllListings() {
        //return transporterTripRepository.findAll();
        return transporterTripRepository.findByIsHiddenFalseAndTransporterDeletedAtIsNullAndTransporterIsBlockedFalse();
    }

    public void deleteListing(Long id) {
        transporterTripRepository.deleteById(id);
    }

    public void hideListing(Long id) {
        TransporterTrip listing = transporterTripRepository.findById(id)
                .orElseThrow();

        listing.setHidden(true);
        transporterTripRepository.save(listing);
    }

    public List<AdminUserRowDTO> getAllUsersIncludingDeleted() {
        return adminUserReadRepository.findAllUsersIncludingDeletedRaw()
            .stream()
            .map(this::mapUserRow)
            .toList();
    }

    public List<AdminTripRowDTO> getAllTripsIncludingDeletedTransporters() {
        return adminTripReadRepository.findAllTripsIncludingDeletedTransportersRaw()
            .stream()
            .map(this::mapTripRow)
            .toList();
    }

    private AdminUserRowDTO mapUserRow(Object[] r) {
        return new AdminUserRowDTO(
                toLong(r[0]),
                (String) r[1],
                (String) r[2],
                (String) r[3],
                (String) r[4],
                toBoolean(r[5]),
                toBooleanObject(r[6]),
                toBooleanObject(r[7]),
                toInstant(r[8]),
                toInstant(r[9])
        );
    }

    private AdminTripRowDTO mapTripRow(Object[] r) {
        return new AdminTripRowDTO(
                toLong(r[0]),
                (String) r[1],
                (String) r[2],
                (String) r[3],
                (String) r[4],
                toLocalDate(r[5]),
                toBigDecimal(r[6]),
                toBigDecimal(r[7]),
                toBoolean(r[8]),
                toBooleanObject(r[9]),
                (String) r[10],
                toLong(r[11]),
                (String) r[12],
                (String) r[13],
                (String) r[14],
                toBoolean(r[15]),
                toInstant(r[16]),
                toInstant(r[17])
        );
    }

    private Long toLong(Object value) {
        return value == null ? null : ((Number) value).longValue();
    }

    private boolean toBoolean(Object value) {
        if (value == null) return false;
        if (value instanceof Boolean b) return b;
        if (value instanceof Number n) return n.intValue() != 0;
        return Boolean.parseBoolean(value.toString());
    }

    private Boolean toBooleanObject(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean b) return b;
        if (value instanceof Number n) return n.intValue() != 0;
        return Boolean.parseBoolean(value.toString());
    }

    private Instant toInstant(Object value) {
        if (value == null) return null;
        if (value instanceof Timestamp ts) return ts.toInstant();
        if (value instanceof Instant instant) return instant;
        return null;
    }

    private LocalDate toLocalDate(Object value) {
        if (value == null) return null;
        if (value instanceof Date d) return d.toLocalDate();
        if (value instanceof LocalDate ld) return ld;
        return null;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal bd) return bd;
        if (value instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        return null;
    }

}
