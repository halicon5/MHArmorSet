
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


mhset.assignArmorDataToSkillArmorIndex = function(idxSkillArmor, piece) {
	/* Get part, hunter type, and skill points */
}

mhset.clearWorkingData = function() {
	console.log("CALL: mhset.clearWorkingData();");
	this.workingSet = {};
	this.workingSet.targetSkills = {};
	this.workingSet.candidates = {};
	this.workingSet.candidates.Head = {};
	this.workingSet.candidates.Body = {};
	this.workingSet.candidates.Arms = {};
	this.workingSet.candidates.Waist = {};
	this.workingSet.candidates.Legs = {};
	this.workingSet.candidates.Jewel = {};
	this.workingSet.combinations = [];
	console.log("COMPLETE: mhset.clearWorkingData();");
}

mhset.initializeRarityLimits = function() {
	console.log("CALL: mhset.initializeRarityLimits();");
	this.rarityLimits = {};
	this.rarityLimits.Head = {min: 1, max: 6};
	this.rarityLimits.Body = {min: 1, max: 6};
	this.rarityLimits.Arms = {min: 1, max: 6};
	this.rarityLimits.Waist = {min: 1, max: 6};
	this.rarityLimits.Legs = {min: 1, max: 6};
	this.rarityLimits.Jewel = {min: 1, max: 6};
	console.log("COMPLETE: mhset.initializeRarityLimits();");
}

mhset.setWorkingValidSkill = function(aUnlockSkill) {
	console.log("CALL: mhset.setWorkingValidSkill('" + aUnlockSkill + "');");

	if (this.SkillList[aUnlockSkill]) {
		this.workingSet.targetSkills[aUnlockSkill] = {};
		this.workingSet.targetSkills[aUnlockSkill].SkillName = this.SkillList[aUnlockSkill].SkillName;
		this.workingSet.targetSkills[aUnlockSkill].PointReq = this.SkillList[aUnlockSkill].PointReq;
	} else {
		console.log("WARN: mhset.setWorkingValidSkill('" + aUnlockSkill + "'); Skill Not Found");
	}
	console.log("COMPLETE: mhset.setWorkingValidSkill('" + aUnlockSkill + "');");
}

mhset.getArmorPiecesByTargetSkills = function(aHunterType) {
	console.log("CALL: mhset.getArmorPiecesByTargetSkills();");
	this.workingSet.canditates = {};
	this.setArmorCandidates(aHunterType, "Head");
	this.setArmorCandidates(aHunterType, "Body");
	this.setArmorCandidates(aHunterType, "Arms");
	this.setArmorCandidates(aHunterType, "Waist");
	this.setArmorCandidates(aHunterType, "Legs");
	this.setArmorCandidates(aHunterType, "Jewel");
	console.log("COMPLETE: mhset.getArmorPiecesByTargetSkills();");
}


mhset.setArmorCandidates = function(aHunterType, aBodyPart) {
	console.log("CALL: mhset.setArmorCandidates(" + aHunterType + ", " + aBodyPart + ");");

	var targSkSc =	this.workingSet.targetSkills;
	var candSc =	this.workingSet.candidates[aBodyPart];

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

	for (var ap in this.SkillArmorIndex[aSkillName]) {
		var saiSc = this.SkillArmorIndex[aSkillName][ap];
		if (	
				saiSc.Part == aBodyPart 
				&& saiSc.SkillPoints > 0
				&& saiSc.Rarity >= this.rarityLimits[aBodyPart].min && saiSc.Rarity <= this.rarityLimits[aBodyPart].max 
				&& (saiSc.HunterType == "Both" || saiSc.HunterType == aHunterType)
			) {
			candidateRepos[ap] = {};
		}
	}

	// Allow for any 1,2, or 3 Slot piece to beconsidered as well
	if (aBodyPart !== 'Jewel') {
		candidateRepos["_" + aHunterType + "0Slot" + aBodyPart] = {};
		candidateRepos["_" + aHunterType + "1Slot" + aBodyPart] = {};
		candidateRepos["_" + aHunterType + "2Slot" + aBodyPart] = {};
		candidateRepos["_" + aHunterType + "3Slot" + aBodyPart] = {};
	}
}

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

						this.calculateInitialViability(setObj);
						setArray[i++] = setObj;

						if (i > 1000) {
							break;
						}
					}
				}
			}
		}
	}
	this.workingSet.combinations = setArray;
}


mhset.calculateInitialViability = function(armorSet) {
	var slot1s;
	var slot2s;
	var slot3s;
	var slotTotal;
	armorSet.targetSkills = {};
	for (var targSkill in this.workingSet.targetSkills) {
		armorSet.targetSkills[this.workingSet.targetSkills[targSkill].SkillName] = {};
	}
}



mhset.test = function() {
	mhset.setWorkingValidSkill("Challenger +2");
	mhset.setWorkingValidSkill("Evasion +1");
	mhset.setWorkingValidSkill("Sharpness +1");
	mhset.getArmorPiecesByTargetSkills("Blademaster");

	mhset.createExperimentalSets();
	//mhset.setArmorCandidates("Blademaster","Head");


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