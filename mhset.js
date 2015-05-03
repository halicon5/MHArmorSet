
/*
Declare Constants
*/
mhset.TORSOUPWEIGHT = 3;
mhset.SLOTWEIGHT = 1;


mhset.initialize = function() {
	console.log("CALL: mhset.initialize();");

	this.rawoutput = document.getElementById("rawoutput");
	this.failures = [];
//	this.failures[0] = "initialize";

	this.createSkillArmorIndexes();
	this.clearWorkingData();
	this.initializeRarityLimits();
	this.UserHunterType = "Blademaster";
	this.UserGender = "Male";
	this.WeaponSlots = 1;
	this.Talisman = {};
	this.Talisman.Slots = 1;
	this.Talisman.Skill1 = "Evasion";
	this.Talisman.Skill2 = "Handicraft";
	this.Talisman.Skill1Points = 2;
	this.Talisman.Skill2Points = 1;

	this.ExclusionLists = {};
	this.ExclusionLists.Head = {};
	this.ExclusionLists.Body = {};
	this.ExclusionLists.Arms = {};
	this.ExclusionLists.Waist = {};
	this.ExclusionLists.Legs = {};
	this.ExclusionLists.Jewel = {};
//	this.test();
	console.log("COMPLETE: mhset.initialize();");	
}

mhset.createSkillArmorIndexes = function() {
	console.log("CALL: mhset.createSkillArmorIndex();");
	if (this.SkillArmorData) {
		var sadSc = this.SkillArmorData;

		this.SkillArmorIndex = {};
		this.ArmorSkillIndex = {};
		for (var i = 0; i < sadSc.length; i++) {
			var r = sadSc[i];
			var failflag = false;
			if (!this.ArmorPieces[r.ArmorPiece] && !this.Jewels[r.ArmorPiece]) {
				failflag = true;
				var failureObj = {};
				var failTag = r.ArmorPiece;
				var failMsg = "WARN: mhset.createSkillArmorIndexes() [" + i + "] Unable to find ArmorPiece or Jewel reference for " + r.ArmorPiece;
				var failIndex = this.failures.length;
				failureObj.failTag = failTag;
				failureObj.failMsg = failMsg;

				this.failures[failIndex] = failureObj;
			}

			if (!failflag) {
				// Build skill references
				var part;
				var hunterType;
				var rarity;
				if (this.ArmorPieces[r.ArmorPiece]) {
					part = this.ArmorPieces[r.ArmorPiece].Part;
					hunterType = this.ArmorPieces[r.ArmorPiece].HunterType;
					rarity = this.ArmorPieces[r.ArmorPiece].Rarity;
				}
				else if (this.Jewels[r.ArmorPiece]) {
					part = "Jewel";
					hunterType = "Both";
					rarity = this.Jewels[r.ArmorPiece].Rarity;
				}

				if (!this.SkillArmorIndex[r.SkillName]) {
					this.SkillArmorIndex[r.SkillName] = {};
				}
				var skSc = this.SkillArmorIndex[r.SkillName];
				skSc[r.ArmorPiece] = {};
				skSc[r.ArmorPiece].SkillPoints = r.SkillPoints;
				skSc[r.ArmorPiece].Part = part;
				skSc[r.ArmorPiece].HunterType = hunterType;
				skSc[r.ArmorPiece].Rarity = rarity;

				// Build armor references
				if (!this.ArmorSkillIndex[r.ArmorPiece]) {
					this.ArmorSkillIndex[r.ArmorPiece] = {};
				}
				var armSc = this.ArmorSkillIndex[r.ArmorPiece];
				armSc[r.SkillName] = {};
				armSc[r.SkillName].SkillPoints = r.SkillPoints;
				armSc[r.SkillName].Part = part;
				armSc[r.SkillName].HunterType = hunterType;
				armSc[r.SkillName].Rarity = rarity;
			}
		}
	}
//	this.rawoutput.appendChild(mhset.spitOutTable(this.failures));
	console.log("COMPLETE: mhset.createSkillArmorIndex();");	
}

mhset.initializeRarityLimits = function() {
	console.log("CALL: mhset.initializeRarityLimits();");
	this.rarityLimits = {};
	this.rarityLimits.Head = {min: 3, max: 4};
	this.rarityLimits.Body = {min: 3, max: 4};
	this.rarityLimits.Arms = {min: 3, max: 4};
	this.rarityLimits.Waist = {min: 3, max: 4};
	this.rarityLimits.Legs = {min: 3, max: 4};
	this.rarityLimits.Jewel = {min: 1, max: 10};
	console.log("COMPLETE: mhset.initializeRarityLimits();");
}

mhset.assignArmorDataToSkillArmorIndex = function(idxSkillArmor, piece) {
	/* Get part, hunter type, and skill points */
}




/*
____    __    ____  ______   .______       __  ___  __  .__   __.   _______ 
\   \  /  \  /   / /  __  \  |   _  \     |  |/  / |  | |  \ |  |  /  _____|
 \   \/    \/   / |  |  |  | |  |_)  |    |  '  /  |  | |   \|  | |  |  __  
  \            /  |  |  |  | |      /     |    <   |  | |  . `  | |  | |_ | 
   \    /\    /   |  `--'  | |  |\  \----.|  .  \  |  | |  |\   | |  |__| | 
    \__/  \__/     \______/  | _| `._____||__|\__\ |__| |__| \__|  \______| 
                                                                            
     _______. _______ .___________.    _______.                             
    /       ||   ____||           |   /       |                             
   |   (----`|  |__   `---|  |----`  |   (----`                             
    \   \    |   __|      |  |        \   \                                 
.----)   |   |  |____     |  |    .----)   |                                
|_______/    |_______|    |__|    |_______/                                 
                                                                            
*/

mhset.clearWorkingData = function() {
	console.log("CALL: mhset.clearWorkingData();");
	this.workingSet = {};
	this.workingSet.targetUnlockSkills = {};
	this.workingSet.candidates = {};
	this.workingSet.candidates.Head = {};
	this.workingSet.candidates.Body = {};
	this.workingSet.candidates.Arms = {};
	this.workingSet.candidates.Waist = {};
	this.workingSet.candidates.Legs = {};
	this.workingSet.candidates.Jewel = {};
	this.workingSet.combinations = [];
	this.workingSet.bestJewels = {};
	console.log("COMPLETE: mhset.clearWorkingData();");
}



mhset.setWorkingValidSkill = function(aUnlockSkill) {
	console.log("CALL: mhset.setWorkingValidSkill('" + aUnlockSkill + "');");

	if (this.SkillList[aUnlockSkill]) {
		this.workingSet.targetUnlockSkills[aUnlockSkill] = {};
		this.workingSet.targetUnlockSkills[aUnlockSkill].SkillName = this.SkillList[aUnlockSkill].SkillName;
		this.workingSet.targetUnlockSkills[aUnlockSkill].PointReq = this.SkillList[aUnlockSkill].PointReq;
	} else {
		console.log("WARN: mhset.setWorkingValidSkill('" + aUnlockSkill + "'); Skill Not Found");
	}
	console.log("COMPLETE: mhset.setWorkingValidSkill('" + aUnlockSkill + "');");
}

mhset.getArmorPiecesByTargetSkills = function(aHunterType) {
	console.log("CALL: mhset.getArmorPiecesByTargetSkills();");
	this.workingSet.candidates = {};
	this.setArmorCandidates(aHunterType, "Head");
	this.setArmorCandidates(aHunterType, "Body");
	this.setArmorCandidates(aHunterType, "Arms");
	this.setArmorCandidates(aHunterType, "Waist");
	this.setArmorCandidates(aHunterType, "Legs");
	this.setArmorCandidates(aHunterType, "Jewel");
	this.getJewelDetails(this.workingSet.candidates.Jewel);
	this.getSkillJewelIndex(this.workingSet.candidates.Jewel);
	console.log("COMPLETE: mhset.getArmorPiecesByTargetSkills();");
}


mhset.setArmorCandidates = function(aHunterType, aBodyPart) {
	console.log("CALL: mhset.setArmorCandidates(" + aHunterType + ", " + aBodyPart + ");");

	var targSkSc =	this.workingSet.targetUnlockSkills;
	var candSc =	this.workingSet.candidates[aBodyPart] = {};

	// Look at each skill target skill and loop through them.
	for (var sk in targSkSc) {
		var skillName = targSkSc[sk].SkillName;
		this.findArmorCandidates(candSc, skillName, aHunterType, aBodyPart);
	}

	console.log("COMPLETE: mhset.setArmorCandidates(" + aHunterType + ", " + aBodyPart + ");");
}


mhset.findArmorCandidates = function(candidateRepos, aSkillName, aHunterType, aBodyPart) {
	/*
	Any piece with Torso up is alawys candidate and will be included
	*/	
	/* // Removed 5/2/2015
	for (var ap in this.SkillArmorIndex["Torso Up"]) {
		var saiSc = this.SkillArmorIndex["Torso Up"][ap];
		if (	
				saiSc.Part == aBodyPart 
				&& saiSc.Rarity >= this.rarityLimits[aBodyPart].min && saiSc.Rarity <= this.rarityLimits[aBodyPart].max 
				&& (saiSc.HunterType == "Both" || saiSc.HunterType == aHunterType)
			) {
			candidateRepos[ap] = {};
		}
	}
	*/
	if (aBodyPart !== 'Jewel' && aBodyPart !== "Body") { 
		candidateRepos["_" + aHunterType + "TorsoUp" + aBodyPart] = {};
	}

	for (var ap in this.SkillArmorIndex[aSkillName]) {
		var saiSc = this.SkillArmorIndex[aSkillName][ap];
		if (	
				saiSc.Part == aBodyPart 
				&& !this.ExclusionLists[aBodyPart][ap]
				&& saiSc.SkillPoints > 0
				&& saiSc.Rarity >= this.rarityLimits[aBodyPart].min && saiSc.Rarity <= this.rarityLimits[aBodyPart].max 
				&& (saiSc.HunterType == "Both" || saiSc.HunterType == aHunterType)
			) {
			candidateRepos[ap] = {};
		}
	}

	// Allow for any 1,2, or 3 Slot piece to beconsidered as well
	if (aBodyPart !== 'Jewel') {
//		candidateRepos["_" + aHunterType + "0Slot" + aBodyPart] = {};
		candidateRepos["_" + aHunterType + "1Slot" + aBodyPart] = {};
		candidateRepos["_" + aHunterType + "2Slot" + aBodyPart] = {};
		candidateRepos["_" + aHunterType + "3Slot" + aBodyPart] = {};
	}

}

mhset.getJewelDetails = function(aJewelCands) {
	for (var j in aJewelCands) {
		if (this.Jewels[j]) {
			aJewelCands[j].Slots = this.Jewels[j].Slots;
			aJewelCands[j].SlotCount = this.Jewels[j].SlotCount;
			aJewelCands[j].Skills = {};
			if (this.ArmorSkillIndex[j]) {
				for (var sk in this.ArmorSkillIndex[j]) {
					aJewelCands[j].Skills[sk] = this.ArmorSkillIndex[j][sk].SkillPoints;
				}
			}
		}
	}
}

mhset.getSkillJewelIndex = function(aJewelCands) {
	this.workingSet.SkillJewelIndex = {};
	for (var tus in this.workingSet.targetUnlockSkills) {
		if (!this.workingSet.SkillJewelIndex[this.workingSet.targetUnlockSkills[tus].SkillName]) {
			this.workingSet.SkillJewelIndex[this.workingSet.targetUnlockSkills[tus].SkillName] = {};
		}
		var skjSc = this.workingSet.SkillJewelIndex[this.workingSet.targetUnlockSkills[tus].SkillName];
	}

	for (var sk in this.workingSet.SkillJewelIndex) {
//		if (jcand )
		for (var j in this.workingSet.candidates.Jewel) {
			var cjSc = this.workingSet.candidates.Jewel[j];
			if (cjSc.Skills[sk]) {
				this.workingSet.SkillJewelIndex[sk][j] = {};
				this.workingSet.SkillJewelIndex[sk][j].SkillPoints = cjSc.Skills[sk];
				this.workingSet.SkillJewelIndex[sk][j].SlotCount = cjSc.SlotCount;
			}
		}
		this.getBestJewelBySlotReq(sk, this.workingSet.SkillJewelIndex[sk]);
	}

}

mhset.getBestJewelBySlotReq = function(skillName, jewelList) {
	this.workingSet.bestJewels[skillName] = {};
	this.workingSet.bestJewels[skillName].singleSlot = {"Jewel": null, "SkillPoints":0};
	this.workingSet.bestJewels[skillName].doubleSlot = {"Jewel": null, "SkillPoints":0};
	this.workingSet.bestJewels[skillName].tripleSlot = {"Jewel": null, "SkillPoints":0};

	for (var j in jewelList) {
		var slotIndex= null;
		switch(jewelList[j].SlotCount) {
			case 1:
				slotIndex = "singleSlot";
				break;
			case 2:
				slotIndex = "doubleSlot";
				break;
			case 3:
				slotIndex = "tripleSlot";
				break;
			default:
				slotIndex = null;
		}
		if (slotIndex 
			&& this.workingSet.bestJewels[skillName][slotIndex].SkillPoints < jewelList[j].SkillPoints) {
			this.workingSet.bestJewels[skillName][slotIndex].SkillPoints =jewelList[j].SkillPoints;
			this.workingSet.bestJewels[skillName][slotIndex].Jewel = j;
		}
	}

}





/*
http://patorjk.com/software/taag/#p=display&f=Star%20Wars&t=Experimental%0ASets
 __________   ___ .______    _______ .______       __  .___  ___.  _______ .__   __. .___________.    ___       __      
|   ____\  \ /  / |   _  \  |   ____||   _  \     |  | |   \/   | |   ____||  \ |  | |           |   /   \     |  |     
|  |__   \  V  /  |  |_)  | |  |__   |  |_)  |    |  | |  \  /  | |  |__   |   \|  | `---|  |----`  /  ^  \    |  |     
|   __|   >   <   |   ___/  |   __|  |      /     |  | |  |\/|  | |   __|  |  . `  |     |  |      /  /_\  \   |  |     
|  |____ /  .  \  |  |      |  |____ |  |\  \----.|  | |  |  |  | |  |____ |  |\   |     |  |     /  _____  \  |  `----.
|_______/__/ \__\ | _|      |_______|| _| `._____||__| |__|  |__| |_______||__| \__|     |__|    /__/     \__\ |_______|
                                                                                                                        
     _______. _______ .___________.    _______.                                                                         
    /       ||   ____||           |   /       |                                                                         
   |   (----`|  |__   `---|  |----`  |   (----`                                                                         
    \   \    |   __|      |  |        \   \                                                                             
.----)   |   |  |____     |  |    .----)   |                                                                            
|_______/    |_______|    |__|    |_______/                                                                             
                                                                                                                        
*/








mhset.createExperimentalSets = function() {
	var cand = this.workingSet.candidates;
	var i = 0;
	var setArray = [];
	for (var ch in cand.Head) {
		for (var cb in cand.Body) {
			for (var ca in cand.Arms) {
				for (var cw in cand.Waist) {
					for (var cl in cand.Legs) {
						var setObj = {};
						setObj.Head = ch;
						setObj.Body = cb;
						setObj.Arms = ca;
						setObj.Waist = cw;
						setObj.Legs = cl;
						setObj.ViabilityRank = 0;
						this.calculateInitialViability(setObj);

						if (i < 100) {
							setArray[i++] = setObj;
						}
					}
				}
			}
		}
		if (i > 1) {
			break;
		}
	}
	this.workingSet.combinations = setArray;
}


mhset.calculateInitialViability = function(armorSet) {
	armorSet.slot1s = 0;
 	armorSet.slot2s = 0;
	armorSet.slot3s = 0;
	armorSet.slotTotal = 0;
	armorSet.TorsoUps = 0;
	armorSet.TorsoSlots = 0;
	armorSet.targetSkills = {};
	armorSet.JemSets = [];

	this.calculateArmorSlots(armorSet);
	this.countTorsoUps(armorSet);

	for (var targSkill in this.workingSet.targetUnlockSkills) {
		var skillName = this.workingSet.targetUnlockSkills[targSkill].SkillName;
		var pointReq = this.workingSet.targetUnlockSkills[targSkill].PointReq;
		armorSet.targetSkills[skillName] = {};
		armorSet.targetSkills[skillName].SkillName = skillName;
		armorSet.targetSkills[skillName].PointReq = pointReq;
		armorSet.targetSkills[skillName].RawSkillPoints = 0;
		armorSet.targetSkills[skillName].RawTorsoUpBonus = 0;
		armorSet.targetSkills[skillName].JewelPointsRequired = 0;
		armorSet.targetSkills[skillName].TalismanPoints = 0;
	}

	this.calculateRawTargetSkills(armorSet);
	this.determineViableGemCombinations(armorSet);

	this.assignViabiltyRank(armorSet);

}

mhset.calculateArmorSlots = function(armorSet) {
	if (armorSet) {
		var headSlots = mhset.getSlotCountForPiece(armorSet.Head);
		var bodySlots = mhset.getSlotCountForPiece(armorSet.Body);
		var armsSlots = mhset.getSlotCountForPiece(armorSet.Arms);
		var waistSlots = mhset.getSlotCountForPiece(armorSet.Waist);
		var legsSlots = mhset.getSlotCountForPiece(armorSet.Legs);

		if (headSlots >= 1 && headSlots <= 3) {
			armorSet["slot" + headSlots + "s"]++;
		}
		if (bodySlots >= 1 && bodySlots <= 3) {
			armorSet["slot" + bodySlots + "s"]++;
			armorSet.TorsoSlots = bodySlots;
		}
		if (armsSlots >= 1 && armsSlots <= 3) {
			armorSet["slot" + armsSlots + "s"]++;
		}
		if (waistSlots >= 1 && waistSlots <= 3) {
			armorSet["slot" + waistSlots + "s"]++;
		}
		if (legsSlots >= 1 && legsSlots <= 3) {
			armorSet["slot" + legsSlots + "s"]++;
		}
		if (this.WeaponSlots >= 1 && this.WeaponSlots) {
			armorSet["slot" + this.WeaponSlots + "s"]++;
		}
		if (this.Talisman.Slots >= 1 && this.Talisman.Slots) {
			armorSet["slot" + this.Talisman.Slots + "s"]++;
		}
		armorSet.slotTotal = headSlots + bodySlots + armsSlots + waistSlots + legsSlots + this.WeaponSlots + this.Talisman.Slots;
	}
}

mhset.getSlotCountForPiece = function(aArmorPiece) {
	if (aArmorPiece && this.ArmorPieces[aArmorPiece]) {
		return this.ArmorPieces[aArmorPiece].SlotCount;
	}
	else {
		return 0;
	}
}


mhset.countTorsoUps = function(armorSet) {
	armorSet.TorsoUps += mhset.checkForTorsoUp(armorSet.Head);
	armorSet.TorsoUps += mhset.checkForTorsoUp(armorSet.Arms);
	armorSet.TorsoUps += mhset.checkForTorsoUp(armorSet.Waist);
	armorSet.TorsoUps += mhset.checkForTorsoUp(armorSet.Legs);
}

mhset.checkForTorsoUp = function(aArmorPiece) {
	if (this.SkillArmorIndex["Torso Up"] && this.SkillArmorIndex["Torso Up"][aArmorPiece]) {
		return 1;
	}
	else {
		return 0;
	}
}

mhset.calculateRawTargetSkills = function(armorSet) {
	if (armorSet) {
		for (var targSkill in armorSet.targetSkills) {
			var asTsSc = armorSet.targetSkills[targSkill];

			asTsSc.RawSkillPoints += this.getSkillPointsByArmorPiece(armorSet.Head, targSkill);
			asTsSc.RawTorsoUpBonus = this.getSkillPointsByArmorPiece(armorSet.Body, targSkill) * armorSet.TorsoUps;
			asTsSc.RawSkillPoints += this.getSkillPointsByArmorPiece(armorSet.Body, targSkill);
			asTsSc.RawSkillPoints += this.getSkillPointsByArmorPiece(armorSet.Arms, targSkill);
			asTsSc.RawSkillPoints += this.getSkillPointsByArmorPiece(armorSet.Waist, targSkill);
			asTsSc.RawSkillPoints += this.getSkillPointsByArmorPiece(armorSet.Legs, targSkill);

			if (this.Talisman.Skill1 === targSkill) {
				asTsSc.TalismanPoints += this.Talisman.Skill1Points;
			}
			if (this.Talisman.Skill2 === targSkill) {
				asTsSc.TalismanPoints += this.Talisman.Skill2Points;
			}

			asTsSc.JewelPointsRequired = asTsSc.PointReq - asTsSc.TalismanPoints - asTsSc.RawSkillPoints - asTsSc.RawTorsoUpBonus;
		}
	}
}

mhset.getSkillPointsByArmorPiece = function(aArmorPiece, aSkillName) {
	if (mhset.ArmorSkillIndex[aArmorPiece] && mhset.ArmorSkillIndex[aArmorPiece][aSkillName] ) {
		return mhset.ArmorSkillIndex[aArmorPiece][aSkillName].SkillPoints;
	} else {
		return 0;
	}
}



mhset.determineViableGemCombinations = function(armorSet) {
	/*
	- look at each skill deficit in targetSkills
	- If any single skill on the list can't work even if every gem is used for that skill, reject the whole set.
	*/
	for (var targSk in armorSet.targetSkills) {
		if (armorSet.ViabilityRank >= 0) {
			this.checkAllInGemViability(armorSet, armorSet.targetSkills[targSk].SkillName);
		}
	}
}

mhset.checkAllInGemViability = function(armorSet, skillName) {
	/* 
	Check against any torso slots with torso up as options
	Fill other slots
	*/


	var targJewelPoints = armorSet.targetSkills[skillName].JewelPointsRequired;
	var jewelPointsTot = 0;
	var jewelOpts = this.workingSet.SkillJewelIndex[skillName];
	if (jewelOpts) {
		// Check torso slot first and account for torso ups
		jewelPointsTot = this.applyTorsoSlotsSimple(armorSet,jewelOpts);
	}
}

mhset.applyTorsoSlotsSimple = function(armorSet, jewelOpts) {

}

mhset.assignViabiltyRank = function(armorSet) {

}










mhset.spitOutTable = function(obj) {
	if (obj) {
		var t = document.createElement("table");
		for (var k in obj) {
			var r = document.createElement("tr");
			var c1 = document.createElement("td");
			r.appendChild(c1);
			t.appendChild(r);
			c1.innerHTML = k;

			if (obj[k]) {

				for(rk in obj[k]) {
					var c2 = document.createElement("td");
					r.appendChild(c2);
					c2.innerHTML = obj[k][rk];
				}
			}
		}
		return t;
	}
	else {
		return document.createElement("div");
	}
}






mhset.test = function() {
	mhset.ExclusionLists.Body["Gore Mail"] = 1;
	mhset.ExclusionLists.Jewel["Artisan Jewel 3"] = 1;

	mhset.setWorkingValidSkill("Challenger +2");
	mhset.setWorkingValidSkill("Evasion +1");
	mhset.setWorkingValidSkill("Sharpness +1");
	mhset.getArmorPiecesByTargetSkills("Blademaster");

	mhset.createExperimentalSets();
	//mhset.setArmorCandidates("Blademaster","Head");


}
