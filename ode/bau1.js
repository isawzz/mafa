
function wsHowMany(deck,prop,val,op){

}
	
function wsGetPower(){

	let powers={
		child_1_any:['WHEN ACTIVATED: Place 1 child on any card'],
		child_2_1:['WHEN ACTIVATED: Place 2 child on any card'],
		child_1_class:[],
		child_1_sym:[],
		child_1_color:[],
		card_1_deck:[],
		card_2_1:[],
		draw_2:[],
		tuck_1_food:[],
		tuck_1_card:[],
		tuck_1_child:[],
		mission:[],
		food_1_supply:[],
		food_1_tray:[],
		food_2_1:[],
		food_1_all:[],
		food_1_sym:[],
		food_tuck_1:[],
		hunt_card:[],
		hunt_food:[],
		pink_hunt_food:[],
		pink_habitat_food:[],
		pink_child_child_sym:[],
		white_2_food:[],
		white_all_food:[],
		white_2_card:[],
		white_3_1:[],
		move_habitat:[],
		//change_card_positions:[],

	};
	return rChoose(Object.keys(powers));
}
function wsGetMission(){

	let missions={
		class:[],
		food_only:[],
		food_specific:[],
		size_atMost:[],
		size_arLeast:[],
		weight_AtMost:[],
		weight_AtLeast:[],
		cards_hand:[],
		cards_board:[],
		cards_habitat:[],
		habitat_only:[],
		tuck:[],
		powerColor:[],
	}
	return rChoose(Object.keys(missions));

}


