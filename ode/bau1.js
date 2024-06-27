
function wsHowMany(deck,prop,val,op){

}
	
function wsGetPower(key,prop){

	let powers={
		_child_1_sym:[],
		_child_2_sym:[],
		_child_1_class:[],
		_child_2_class:[],
		_child_1_color:[],
		_child_2_color:[],
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
		white_child_1_sym:[],
		white_child_1_class:[],
		white_child_1_color:[],
		_move_habitat:[],
		lightblue_food_1:[],
		_repeat:[]
		//change_card_positions:[],

	};
	return nundef(key)? rChoose(Object.keys(powers)):nundef(prop)?powers[key]:lookup(powers,[key,prop]);
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


