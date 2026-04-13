package com.diasporabridge.backend.admin.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import com.diasporabridge.backend.user.entity.User;

import java.util.List;

public interface AdminUserReadRepository extends Repository<User, Long>{
    @Query(value = """
        SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.role,
            u.is_blocked,
            u.is_active,
            u.email_verified,
            u.deleted_at,
            u.created_at
        FROM users u
        ORDER BY u.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findAllUsersIncludingDeletedRaw();
}
