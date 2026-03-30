package DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor
public class AdminDashboardStatsDTO {
    private long totalUsers;
    private long totalListings;
    private long totalParcelRequests;
    private long totalMatches;
    private long totalMessages;
}
