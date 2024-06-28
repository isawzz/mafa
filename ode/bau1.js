
function wsHowMany(deck,prop,val,op){

}
	
function wsGetPower(colorOrKey,prop){

	let powers={
		_child_1_sym:[],
		_child_2_sym:[],
		_child_1_class:[],
		_child_2_class:[],
		_child_1_color:[],
		_child_2_color:[],
		_draw_1_card_deck:[],
		_draw_2_card_return_1:[],
		_draw_2_card_1:[],
		_tuck_1_pick_feeder:[],
		_tuck_1_pick_supply:[],
		_tuck_1_draw_tray:[],
		_tuck_1_draw_deck:[],
		_tuck_1_place:[],
		_food_1_supply:[],
		_food_1_feeder:[],
		_food_2_supply:[],
		_food_2_tray:[],
		_discard_1_child_pick_2_food_feeder:[],
		_discard_1_child_pick_1_food_supply:[],
		_discard_1_child_draw_2_card:[],
		_discard_1_food_draw_1_card:[],
		_discard_1_card_pick_1_food_supply:[],
		_repeat:[],
		_hunt_food_mouse:[],
		_hunt_food_fish:[],
		_hunt_card_insect:[],
		//pink_verb_what_verb_n_what:[]
		pink_draw_mission_pick_1_food_feeder:[],
		pink_place_child_pick_1_food_feeder:[],
		pink_hunt_successfully_pick_1_food_feeder:[],
		pink_draw_mission_draw_1_card_deck:[],
		pink_place_child_draw_1_card_deck:[],
		pink_hunt_successfully_draw_1_card_deck:[],
		white_draw_2_mission_return_1:[],
		white_draw_1_mission:[],
		white_collect_fish:[],
		white_collect_mouse:[],
		white_collect_worm:[],
		white_collect_cherries:[],
		white_child_sym:[],
		white_child_color:[],
		white_child_class:[],
		lightblue_feeder:[],
		lightblue_tray:[],
	};
	let list=Object.keys(powers);
	if (isColor(colorOrKey)) return rChoose(list.filter(x=>colorOrKey == 'brown'?x.startsWith('_'):x.startsWith(colorOrKey)));
	else if (nundef(colorOrKey)) return rChoose(list);
	else if (nundef(prop)) return powers[colorOrKey];
	else return lookup(powers,[colorOrKey,prop]);
}
function isColor(s){ return isdef(M.colorByName[s]);}
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


