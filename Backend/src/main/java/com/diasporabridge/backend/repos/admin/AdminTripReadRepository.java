package com.diasporabridge.backend.repos.admin;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import com.diasporabridge.backend.entities.TransporterTrip;

public interface AdminTripReadRepository extends Repository<TransporterTrip, Long>{
    @Query(value = """
        SELECT
            t.id,
            t.origin_city,
            t.origin_country,
            t.dest_city,
            t.dest_country,
            t.depart_date,
            t.price_per_kg,
            t.max_weight_kg,
            t.is_hidden,
            t.is_active,
            t.note,
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.is_blocked,
            u.deleted_at,
            t.created_at
        FROM transporter_trips t
        JOIN users u ON u.id = t.transporter_id
        ORDER BY t.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findAllTripsIncludingDeletedTransportersRaw();
}
