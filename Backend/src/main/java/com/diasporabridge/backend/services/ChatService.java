package com.diasporabridge.backend.services;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.User;

public interface ChatService {
	
	public Match openChat(Long tripId, User currentUser);
	public void attachParcel(Long matchId, Long parcelId, User currentUser);

}
