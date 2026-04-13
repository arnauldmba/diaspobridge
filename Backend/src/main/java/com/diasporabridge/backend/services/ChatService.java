package com.diasporabridge.backend.services;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.diasporabridge.backend.match.entity.Match;
import com.diasporabridge.backend.user.entity.User;

public interface ChatService {
	
	public Match openChat(Long tripId, User currentUser);
	public void attachParcel(Long matchId, Long parcelId, User currentUser);

}
