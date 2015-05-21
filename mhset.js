/*
This coding project brought to you by sleepless nights and copious amounts of Tanquerey Rangpur gin.
*/


/*
Declare Constants
*/
mhset.TORSOUPWEIGHT = 3;
mhset.SLOTWEIGHT = 1;


mhset.initialize = function() {
	console.log("CALL: mhset.initialize();");

	this.cancelGrinder = false;
	this.maxProcessingChunks = 10000000;
	this.rawoutput = document.getElementById("rawoutput");
	this.scanCount = document.getElementById("scanCount");
	this.failures = [];
//	this.failures[0] = "initialize";

	this.candidateBox = {};
	this.candidateBox.Head = document.getElementById("headCandidates");
	this.candidateBox.Body = document.getElementById("bodyCandidates");
	this.candidateBox.Arms = document.getElementById("armsCandidates");
	this.candidateBox.Waist = document.getElementById("waistCandidates");
	this.candidateBox.Legs = document.getElementById("legsCandidates");
	this.candidateBox.Jewel = document.getElementById("jewelCandidates");

	this.UIObjects = {};
	this.UIObjects.candidateLists = {};
	this.UIObjects.candidateLists.oHead = {};
	this.UIObjects.candidateLists.Head = [];
	this.UIObjects.candidateLists.oBody = {};
	this.UIObjects.candidateLists.Body = [];
	this.UIObjects.candidateLists.oArms = {};
	this.UIObjects.candidateLists.Arms = [];
	this.UIObjects.candidateLists.oWaist = {};
	this.UIObjects.candidateLists.Waist = [];
	this.UIObjects.candidateLists.oLegs = {};
	this.UIObjects.candidateLists.Legs = [];
	this.UIObjects.candidateLists.oJewel = {};
	this.UIObjects.candidateLists.Jewel = [];

	this.createSkillArmorIndexes();
	this.clearWorkingData();
	this.initializeRarityLimits();
	this.UserHunterType = "Blademaster";
	this.UserGender = "Male";
	this.WeaponSlots = 2;
	this.Talisman = {};
	this.Talisman.Slots = 1;
	this.Talisman.Skill1 = "Evasion";
	this.Talisman.Skill2 = "Handicraft";
	this.Talisman.Skill1Points = 0;
	this.Talisman.Skill2Points = 0;

	this.ExclusionLists = {};
	this.ExclusionLists.Head = {};
	this.ExclusionLists.Body = {};
	this.ExclusionLists.Arms = {};
	this.ExclusionLists.Waist = {};
	this.ExclusionLists.Legs = {};
	this.ExclusionLists.Jewel = {};
	this.ExclusionLists.Sets = {};

	this.waitAndLookInterval = null;

	this.jemComboSlots = {};
	this.jemComboSlots.tripleX1 = 3;
	this.jemComboSlots.doubleX1SingleX1 = 3;
	this.jemComboSlots.singleX3 = 3;
	this.jemComboSlots.doubleX1 = 2;
	this.jemComboSlots.singleX2 = 2;
	this.jemComboSlots.singleX1 = 1;

	this.createSkillChoiceDropdowns();
//	this.test();
//	alert('test');
	console.log("COMPLETE: mhset.initialize();");	
}

mhset.changeHunterType = function(sel) {
	alert(sel.selectedIndex);
	var selInd = sel.selectedIndex;
	this.UserHunterType = sel.options[selInd].value;
}


mhset.createSkillArmorIndexes = function() {
	console.log("CALL: mhset.createSkillArmorIndex();");
	if (this.SkillArmorData) {
		var sadSc = this.SkillArmorData;
		this.createSkillListArray();
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

mhset.createSkillListArray = function(){
	this.SkillListArray = [];
	for (var sk in this.SkillList) {
		this.SkillListArray.push(this.SkillList[sk]);
		this.SkillList[sk].ActivatedSkill = sk;
	}
	this.SkillListArray.sort( function(a,b) {
		var skA, skB;
		skA = a.SkillName.toLowerCase();
		skB = b.SkillName.toLowerCase();
		if ( skA < skB ) {
			return -1;
		}
		if (skA > skB ) {
			return 1;
		}
		if (skA == skB) {
			if (a.PointsReq < b.PointsReq) {
				return -1;
			}
			if (a.PointsReq > b.PointsReq) {
				return 1;
			}
		}
		return 0;

	});
}


mhset.initializeRarityLimits = function() {
	console.log("CALL: mhset.initializeRarityLimits();");
	this.rarityLimits = {};
	this.rarityLimits.Head = {min: 0, max: 10};
	this.rarityLimits.Body = {min: 0, max: 10};
	this.rarityLimits.Arms = {min: 0, max: 10};
	this.rarityLimits.Waist = {min: 0, max: 10};
	this.rarityLimits.Legs = {min: 0, max: 10};
	this.rarityLimits.Jewel = {min: 0, max: 10};
	console.log("COMPLETE: mhset.initializeRarityLimits();");
}

mhset.assignArmorDataToSkillArmorIndex = function(idxSkillArmor, piece) {
	/* Get part, hunter type, and skill points */
}


mhset.createSkillChoiceDropdowns = function() {
	this.UIObjects.skillChoiceDrops = {};
	var scdSc = this.UIObjects.skillChoiceDrops;
	for (var di = 1; di <= 6; di++) {
		scdSc["skill" + di] = document.getElementById("skillChoice" + di);

		var nullOpt = document.createElement("option");
		nullOpt.value = "";
		nullOpt.innerHTML = "-- No Skill Selected --";
		scdSc["skill" + di].appendChild(nullOpt);

		for (var i = 0; i < this.SkillListArray.length; i++) {
			if (this.SkillListArray[i].PointReq > 0) {
				var opt = document.createElement("option");
				opt.value = this.SkillListArray[i].ActivatedSkill;
				opt.innerHTML = this.SkillListArray[i].SkillName + ": " + this.SkillListArray[i].ActivatedSkill;
				scdSc["skill" + di].appendChild(opt);
			}
		}
	}
}

mhset.getInitialArmorCandidates = function() {
	this.clearTargetUnlockSkills();
	this.setTargetUnlockSkills();
	this.createCandidateLists();
}

mhset.clearTargetUnlockSkills = function() {
	for (var sk in this.workingSet.targetUnlockSkills) {
		delete this.workingSet.targetUnlockSkills[sk];
	}
}

mhset.setTargetUnlockSkills = function() {
	var sc = this.UIObjects.skillChoiceDrops;
	for (var ui in sc) {
		var selInd = sc[ui].selectedIndex;
		if (sc[ui].options[selInd].value != "") {
			mhset.setWorkingValidSkill(sc[ui].options[sc[ui].selectedIndex].value ,ui);
		}
	}
}

mhset.clearExclusionLists = function () {
	for (var p in this.ExclusionLists) {
		for (var a in this.ExclusionLists[p]) {
			this.ExclusionLists[p][a] = 0;
		}
	}
}

mhset.clearCandidateLists = function () {
	for (var p in this.candidateBox) {
		removeDescendents(this.candidateBox[p]);
	}
	var parts = ["Head","Body","Arms","Waist","Legs"];
	for (var i = 0; i < parts.length; i++ ) {
		delete this.UIObjects.candidateLists[parts[i]];
		this.UIObjects.candidateLists[parts[i]] = [];

		for (var ap in this.UIObjects.candidateLists['o' + parts[i]]) {
			delete this.UIObjects.candidateLists['o' + parts[i]][ap];
		}
	}
}


mhset.createCandidateLists = function() {
	this.clearExclusionLists();
	this.clearCandidateLists();
	this.buildCandidateList("Head");
	this.buildCandidateList("Body");
	this.buildCandidateList("Arms");
	this.buildCandidateList("Waist");
	this.buildCandidateList("Legs");
	this.buildCandidateList("Jewel");
}

mhset.buildCandidateList = function(aBodyPart) {
	console.log(aBodyPart);
	var candBox = this.candidateBox[aBodyPart];
	var candUIlist = this.UIObjects.candidateLists['o' + aBodyPart];
	var candUIarr = this.UIObjects.candidateLists[aBodyPart];

	this.buildGenericArmorCandidates(candUIlist,aBodyPart);
	for (var targSkill in this.workingSet.targetUnlockSkills) {
		var aSkillName = this.workingSet.targetUnlockSkills[targSkill].SkillName;
		for (var ap in this.SkillArmorIndex[aSkillName]) {
			var saiSc = this.SkillArmorIndex[aSkillName][ap];
			if (	
				saiSc.Part == aBodyPart 
				&& !candUIlist[ap]	// this prevents duplicate UI component builds
				&& saiSc.SkillPoints > 0
				&& saiSc.Rarity >= this.rarityLimits[aBodyPart].min && saiSc.Rarity <= this.rarityLimits[aBodyPart].max 
				&& (saiSc.HunterType == "Both" || saiSc.HunterType == this.UserHunterType)
			) {
				var UIcomps = this.buildCandidateUIcomponents(ap,aBodyPart,saiSc.Rarity);
				if (UIcomps) {
					candUIlist[ap] = UIcomps;
				}
			}
		}
	}

	for (var ap in candUIlist) {
		candUIarr.push(candUIlist[ap]);
	}
	
	// sort it
	candUIarr.sort(function(a,b) {
		if (a.Rarity > b.Rarity) {
			return 1;
		}
		if (a.Rarity < b.Rarity) {
			return -1;
		}
		if (a.Rarity === b.Rarity) {
			if (a.ArmorPiece > b.ArmorPiece) {
				return 1;
			}
			if (a.ArmorPiece < b.ArmorPiece) {
				return -1;
			}
		}
		return 0;
	});

	for (var i = 0; i < candUIarr.length; i++) {
		this.candidateBox[aBodyPart].appendChild(candUIarr[i].divRow);
	}
}


mhset.buildGenericArmorCandidates = function(candUIlist, aBodyPart) {

	if (aBodyPart !== 'Jewel' && aBodyPart !== "Body") { 
		var tup = "_" + this.UserHunterType + "TorsoUp" + aBodyPart;
		candUIlist[tup] = this.buildCandidateUIcomponents(tup,aBodyPart,0);
	}

	if (aBodyPart !== 'Jewel') {
		var s1, s2, s3;
		s1 = "_" +  this.UserHunterType  + "1Slot" + aBodyPart;
		s2 = "_" +  this.UserHunterType  + "2Slot" + aBodyPart;
		s3 = "_" +  this.UserHunterType  + "3Slot" + aBodyPart;
		candUIlist[s1] = this.buildCandidateUIcomponents( s1,aBodyPart,0);
		candUIlist[s2] = this.buildCandidateUIcomponents( s2,aBodyPart,0);
		candUIlist[s3] = this.buildCandidateUIcomponents( s3,aBodyPart,0);
	}
}

mhset.buildCandidateUIcomponents = function(aArmorPiece, aBodyPart, rarity) {
	var divRow = document.createElement("div");
	var divLab = document.createTextNode(" - " + aArmorPiece + ' [' + rarity + ']');
	var chkbx = document.createElement("input");
	chkbx.setAttribute("type","checkbox");
	chkbx.mhsetRef = this;
	chkbx.paramArmorPiece = aArmorPiece;
	chkbx.paramBodyPart = aBodyPart;
	chkbx.checked = true;
	chkbx.onclick = function() {this.mhsetRef.setExclusionListItem(this.paramArmorPiece, this.paramBodyPart, this.checked);}

	var dtlDiv = document.createElement("div");
	dtlDiv.innerHTML = this.getArmorPieceSummary(aArmorPiece);

	divRow.appendChild(chkbx);
	divRow.appendChild(divLab);
	var retObj = {};
	retObj.ArmorPiece = aArmorPiece;
	retObj.chkbx = chkbx;
	retObj.divRow = divRow;
	retObj.Rarity = rarity;
	return retObj;
}

mhset.setExclusionListItem = function(armorPiece, bodyPart, inc) {
	console.log(armorPiece + ' ' + bodyPart + ' ' + inc);
	if (this.ExclusionLists[bodyPart]) {
		this.ExclusionLists[bodyPart][armorPiece] = (inc) ? 0 : 1;
	}	
}


mhset.getArmorPieceSummary = function(aArmorPiece) {

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
	this.workingSet.candidates.HeadArray = new Array();
	this.workingSet.candidates.Body = {};
	this.workingSet.candidates.BodyArray = new Array();
	this.workingSet.candidates.Arms = {};
	this.workingSet.candidates.ArmsArray = new Array();
	this.workingSet.candidates.Waist = {};
	this.workingSet.candidates.WaistArray = new Array();
	this.workingSet.candidates.Legs = {};
	this.workingSet.candidates.LegsArray = new Array();
	this.workingSet.candidates.Jewel = {};
	this.workingSet.candidates.JewelArray = new Array();
	this.workingSet.combinations = new Array();
	this.workingSet.comboCount = 0;
	this.workingSet.bestJewels = {};

	// used for tracking the current iteration during set match making
	this.workingSet.curIndexes = {};
	this.workingSet.curIndexes.Head = 0;
	this.workingSet.curIndexes.Body = 0;
	this.workingSet.curIndexes.Arms = 0;
	this.workingSet.curIndexes.Waist = 0;
	this.workingSet.curIndexes.Legs = 0;

	// completion flags;
	this.workingSet.flags = {};
	this.workingSet.flags.initialViabilityDone = 0;
	console.log("COMPLETE: mhset.clearWorkingData();");
}



mhset.setWorkingValidSkill = function(aUnlockSkill,skillNum) {
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
	this.createFinalCandidateArrays();
	this.getJewelDetails(this.workingSet.candidates.Jewel);
	this.getSkillJewelIndex(this.workingSet.candidates.Jewel);
	console.log("COMPLETE: mhset.getArmorPiecesByTargetSkills();");
}


mhset.setArmorCandidates = function(aHunterType, aBodyPart) {
	console.log("CALL: mhset.setArmorCandidates(" + aHunterType + ", " + aBodyPart + ");");

	var targSkSc =	this.workingSet.targetUnlockSkills;
	var candSc =	this.workingSet.candidates[aBodyPart] = {};
	var candAr = 	this.workingSet.candidates[aBodyPart + 'Array'] = [];
	// Look at each skill target skill and loop through them.
	this.findGenericArmorCandidate(candSc, candAr, aHunterType, aBodyPart);
	for (var sk in targSkSc) {
		var skillName = targSkSc[sk].SkillName;
		this.findArmorCandidates(candSc, candAr, skillName, aHunterType, aBodyPart);
	}
	this.removeCandidateConflicts(candSc);

	console.log("COMPLETE: mhset.setArmorCandidates(" + aHunterType + ", " + aBodyPart + ");");
}

mhset.findGenericArmorCandidate = function(candidateRepos, candidateArray, aHunterType, aBodyPart) {
	console.log("CALL: mhset.findGenericArmorCandidate(" + aHunterType + ", " + aBodyPart + ");");
	/*
	Any piece with Torso up is alawys candidate and will be included
	*/	
	var tup = "_" + aHunterType + "TorsoUp" + aBodyPart;
	if (aBodyPart !== 'Jewel' && aBodyPart !== "Body" && !this.ExclusionLists[aBodyPart][tup]) { 
		candidateRepos[tup] = {};
	}

	// Allow for any 1,2, or 3 Slot piece to beconsidered as well
	if (aBodyPart !== 'Jewel') {
//		candidateRepos["_" + aHunterType + "0Slot" + aBodyPart] = {};
		s1 = "_" +  aHunterType  + "1Slot" + aBodyPart;
		s2 = "_" +  aHunterType  + "2Slot" + aBodyPart;
		s3 = "_" +  aHunterType  + "3Slot" + aBodyPart;
		if (!this.ExclusionLists[aBodyPart][s1]) {
			candidateRepos[s1] = {};
		}

		if (!this.ExclusionLists[aBodyPart][s2]) {
			candidateRepos[s2] = {};
		}

		if (!this.ExclusionLists[aBodyPart][s3]) {
			candidateRepos[s3] = {};
		}
	}
	console.log("COMPLETE: mhset.findGenericArmorCandidate(" + aHunterType + ", " + aBodyPart + ");");
}

mhset.findArmorCandidates = function(candidateRepos, candidateArray, aSkillName, aHunterType, aBodyPart) {

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

}

mhset.removeCandidateConflicts = function(candidateRepos) {
	var targSkSc =	this.workingSet.targetUnlockSkills;
	for (var c in candidateRepos) {
		var negTally = 0;
		for (var sk in targSkSc) {
			if (this.ArmorSkillIndex[c] && this.ArmorSkillIndex[c][sk]) {
				var armSkill = this.ArmorSkillIndex[c][sk];
				if (armSkill.SkillPoints < 0) {
					negTally += armSkill.SkillPoints;
				}
			}
		}
		if (negTally < 0) {
			delete candidateRepos[c];
		}
	}
}

mhset.createFinalCandidateArrays = function() {
	var sc = this.workingSet.candidates;
	sc.HeadArray = [];
	for (var h in sc.Head) {
		sc.HeadArray.push(h);
	}

	sc.BodyArray = [];
	for (var b in sc.Body) {
		sc.BodyArray.push(b);
	}

	sc.ArmsArray = [];
	for (var a in sc.Arms) {
		sc.ArmsArray.push(a);
	}

	sc.WaistArray = [];
	for (var w in sc.Waist) {
		sc.WaistArray.push(w);
	}

	sc.LegsArray = [];
	for (var l in sc.Legs) {
		sc.LegsArray.push(l);
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
	var indicesSc = this.workingSet.curIndexes;
	curHead = indicesSc.Head;
	curBody = indicesSc.Body;
	curArms = indicesSc.Arms;
	curWaist = indicesSc.Waist;
	curLegs = indicesSc.Legs;

	this.workingSet.chunkCount = 0;
    var maxTimePerChunk = 200;
    var maxChunks = this.maxProcessingChunks;
    var cand = this.workingSet.candidates;

    function now() {
        return new Date().getTime();
    }

    function doChunk( curHead, curBody, curArms, curWaist, curLegs) {
		var indicesSc = this.workingSet.curIndexes;

		var legsBreak = 0;
		var waistBreak = 0;
		var armsBreak = 0;
		var bodyBreak = 0;
		var headBreak = 0;

    	this.workingSet.chunkCount++;
    	var cand = this.workingSet.candidates;
    	var startTime = now();
    	this.scanCount.value = this.workingSet.comboCount;
    	//(now() - startTime) <= maxTimePerChunk)
		while (curHead < cand.HeadArray.length ) {
			if (bodyBreak + armsBreak + waistBreak + legsBreak > 0) {
				break;
			}
			if ( (now() - startTime) > maxTimePerChunk ) {
				headBreak = 1;
				break;
			}
			while (curBody < cand.BodyArray.length ) {
				if (armsBreak + waistBreak + legsBreak > 0) {
					break;
				}
				if ( (now() - startTime) > maxTimePerChunk ) {
					bodyBreak = 1;
					break;
				}
				while (curArms < cand.ArmsArray.length) {
					if (waistBreak + legsBreak > 0) {
						break;
					}
					if ( (now() - startTime) > maxTimePerChunk ) {
						armsBreak = 1;
						break;
					}
					while (curWaist < cand.WaistArray.length) {
						if (legsBreak > 0) {
							break;
						}
						if ( (now() - startTime) > maxTimePerChunk ) {
							waistBreak = 1;
							break;
						}
						while (curLegs < cand.LegsArray.length) {
							if ( (now() - startTime) > maxTimePerChunk ) {
								legsBreak = 1;
								break;
							}
							var setObj = {};
							setObj.Head = cand.HeadArray[curHead];
							setObj.Body = cand.BodyArray[curBody];
							setObj.Arms = cand.ArmsArray[curArms];
							setObj.Waist = cand.WaistArray[curWaist];
							setObj.Legs = cand.LegsArray[curLegs];
							setObj.ViabilityRank = 0;
							this.workingSet.comboCount++;
							this.calculateInitialViability(setObj);


							if (setObj.ViabilityRank >= 0) {
								this.workingSet.combinations.push(setObj);
							}

							if (legsBreak == 0) {
								++indicesSc.Legs;
								++curLegs;
							}
						}

						if (legsBreak + waistBreak == 0) {
							curLegs = 0;
							indicesSc.Legs = 0;
							++indicesSc.Waist;
							++curWaist;
						}
					}
					if (legsBreak + waistBreak + armsBreak == 0) {
						curWaist = 0;
						indicesSc.Waist = 0;
						++indicesSc.Arms;
						++curArms;
					}
				}
				if (legsBreak + waistBreak + armsBreak + bodyBreak == 0) {
					curArms = 0;
					indicesSc.Arms = 0;
					++indicesSc.Body;
					++curBody;
				}
			}
			if (legsBreak + waistBreak + armsBreak + bodyBreak + headBreak == 0) {
				curBody = 0;
				indicesSc.Body = 0;
				++indicesSc.Head;
				++curHead;
			}
		}

		if (this.cancelGrinder == true) {
			var msg = "Matchmaking Cancelled By User.";
			this.spitOutToDisplay(msg);
			this.cancelGrinder = false;
			this.workingSet.flags.initialViabilityDone = 1;
		} else if ( this.workingSet.chunkCount < maxChunks &&
	        	curHead < cand.HeadArray.length ) {
            // set Timeout for async iteration
        	var that = this;
            setTimeout(function() {
            	doChunk.call(that, indicesSc.Head, indicesSc.Body, indicesSc.Arms, indicesSc.Waist, indicesSc.Legs);
            },1);
        } else if (this.workingSet.chunkCount >= maxChunks) {
			this.workingSet.flags.initialViabilityDone = 1;
        	var div = document.createElement("div");
        	div.innerHTML = "Chunk limit of " + maxChunks + " reached. No more combinations will be considered";
        	this.rawoutput.appendChild(div);
    	} else {
			this.workingSet.flags.initialViabilityDone = 1;
        	var div = document.createElement("div");
        	div.innerHTML =  this.workingSet.chunkCount + " chunks were examined.";
        	this.rawoutput.appendChild(div);
 		   	this.scanCount.value = this.workingSet.comboCount;
        }

    }

    doChunk.call(this, curHead, curBody, curArms, curWaist, curLegs);

    var intervalContext = this;
    this.waitAndLookInterval = window.setInterval( function() {
		console.log("Interval Function:" + intervalContext.waitAndLookInterval);

    	if (intervalContext.workingSet.flags.initialViabilityDone == 1) {
    		mhset.buildRealArmorSets();
    	}
    },1000);
}




mhset.calculateInitialViability = function(armorSet) {

	armorSet.slot1s = 0;
 	armorSet.slot2s = 0;
	armorSet.slot3s = 0;
	armorSet.slotTotal = 0;
	armorSet.TorsoUps = 0;
	armorSet.TorsoSlots = 0;
	armorSet.targetSkills = {};

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
	this.determineIfThereArePossiblyEnoughSlots(armorSet);
	if (armorSet.ViabilityRank > 0) {
		this.determineViableGemCombinations(armorSet);
	}
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
//			armorSet["slot" + bodySlots + "s"]++;
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
		armorSet.slotTotal = headSlots + armsSlots + waistSlots + legsSlots + this.WeaponSlots + this.Talisman.Slots;
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

mhset.determineIfThereArePossiblyEnoughSlots = function(armorSet) {
	var maxPossiblePointsToJemIn = 0;
	var totalJewelPointsRequired = 0;

	maxPossiblePointsToJemIn = (armorSet.TorsoSlots * 2 * armorSet.TorsoUps) + (armorSet.TorsoSlots + armorSet.slot1s + armorSet.slot2s + armorSet.slot3s) * 2;
	for (var sk in armorSet.targetSkills) {
		totalJewelPointsRequired += armorSet.targetSkills[sk].JewelPointsRequired;
	}
	if (maxPossiblePointsToJemIn < totalJewelPointsRequired) {
		armorSet.ViabilityRank = -1;
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
	if (armorSet.ViabilityRank < 0) {
		return 0;
	}

	var targJewelPoints = armorSet.targetSkills[skillName].JewelPointsRequired;
	var jewelPointsTot = 0;
	var jewelOpts = this.workingSet.bestJewels[skillName];
	if (jewelOpts) {
		// Check torso slot first and account for torso ups
		jewelPointsTot = this.applyTorsoSlotsSimple(armorSet,jewelOpts);
		jewelPointsTot += this.applyNonTorsoSlotsSimple(armorSet, jewelOpts);
	}
	if (jewelPointsTot < targJewelPoints) {
		armorSet.ViabilityRank = -1;
	}
}

mhset.applyTorsoSlotsSimple = function(armorSet, jewelOpts) {
	var jewelSkillPoints = 0;
	switch(armorSet.TorsoSlots) {
		case 0:
			return jewelSkillPoints;
			break;
		case 1:
			jewelSkillPoints = jewelOpts.singleSlot.SkillPoints;
			break;
		case 2:
			if (jewelOpts.doubleSlot.SkillPoints >= (jewelOpts.singleSlot.SkillPoints * 2)) {
				jewelSkillPoints = jewelOpts.doubleSlot.SkillPoints;
			} else {
				jewelSkillPoints = jewelOpts.singleSlot.SkillPoints * 2;
			}
			break;
		case 3:
			jewelSkillPoints = jewelOpts.tripleSlot.SkillPoints;
			if (jewelSkillPoints < jewelOpts.doubleSlot.SkillPoints + jewelOpts.singleSlot.SkillPoints) {
				jewelSkillPoints = jewelOpts.doubleSlot.SkillPoints + jewelOpts.singleSlot.SkillPoints;
			} else if (jewelSkillPoints < jewelOpts.singleSlot.SkillPoints * 3) {
				jewelSkillPoints = jewelOpts.singleSlot.SkillPoints * 3;
			}
			break;
		default:
			return 0;
	}

	return jewelSkillPoints + (jewelSkillPoints * armorSet.TorsoUps);
}

mhset.applyNonTorsoSlotsSimple = function(armorSet, jewelOpts) {
	var singles = armorSet.slot1s;
	var doubles = armorSet.slot2s;
	var triples = armorSet.slot3s;
	var jewelSkillPoints = 0;
	// Attempt to fill everything with the maximum size jewels
	if (triples > 0) {
		jewelSkillPoints = jewelOpts.tripleSlot.SkillPoints * triples;
		if (jewelSkillPoints < jewelOpts.doubleSlot.SkillPoints + jewelOpts.singleSlot.SkillPoints) {
			jewelSkillPoints = (jewelOpts.doubleSlot.SkillPoints + jewelOpts.singleSlot.SkillPoints) * triples;
		} else if (jewelSkillPoints < jewelOpts.singleSlot.SkillPoints * 3) {
			jewelSkillPoints = (jewelOpts.singleSlot.SkillPoints * 3) * triples;
		}		
	}
	if (doubles > 0) {
		if (jewelOpts.doubleSlot.SkillPoints >= (jewelOpts.singleSlot.SkillPoints * 2)) {
			jewelSkillPoints = jewelOpts.doubleSlot.SkillPoints * doubles;
		} else {
			jewelSkillPoints = (jewelOpts.singleSlot.SkillPoints * 2) * doubles;
		}		
	}
	if (singles > 0) {
		jewelSkillPoints = jewelOpts.singleSlot.SkillPoints * singles;
	}
	return jewelSkillPoints;
}


/* ====================================================================
.______    __    __   __   __       _______                                                                        
|   _  \  |  |  |  | |  | |  |     |       \                                                                       
|  |_)  | |  |  |  | |  | |  |     |  .--.  |                                                                      
|   _  <  |  |  |  | |  | |  |     |  |  |  |                                                                      
|  |_)  | |  `--'  | |  | |  `----.|  '--'  |                                                                      
|______/   \______/  |__| |_______||_______/                                                                       
                                                                                                                   
.______       _______     ___       __                                                                             
|   _  \     |   ____|   /   \     |  |                                                                            
|  |_)  |    |  |__     /  ^  \    |  |                                                                            
|      /     |   __|   /  /_\  \   |  |                                                                            
|  |\  \----.|  |____ /  _____  \  |  `----.                                                                       
| _| `._____||_______/__/     \__\ |_______|                                                                       
                                                                                                                   
     ___      .______      .___  ___.   ______   .______                 _______. _______ .___________.    _______.
    /   \     |   _  \     |   \/   |  /  __  \  |   _  \               /       ||   ____||           |   /       |
   /  ^  \    |  |_)  |    |  \  /  | |  |  |  | |  |_)  |             |   (----`|  |__   `---|  |----`  |   (----`
  /  /_\  \   |      /     |  |\/|  | |  |  |  | |      /               \   \    |   __|      |  |        \   \    
 /  _____  \  |  |\  \----.|  |  |  | |  `--'  | |  |\  \----.      .----)   |   |  |____     |  |    .----)   |   
/__/     \__\ | _| `._____||__|  |__|  \______/  | _| `._____|      |_______/    |_______|    |__|    |_______/    
                                                                                                                   
========================================================================*/


mhset.buildRealArmorSets = function() {
	console.log("CALL: mhset.buildRealArmorSets");
	if (this.workingSet.flags.initialViabilityDone == 1) {
		console.log("Clear Interval:" + this.waitAndLookInterval);
		window.clearInterval(this.waitAndLookInterval);

		this.examineEachArmorSetCombination();
	}
	console.log("COMPLETE: mhset.buildRealArmorSets");
}

mhset.examineEachArmorSetCombination = function() {
	console.log("CALL: mhset.examineEachArmorSetCombination");

	for (var i = 0; i < this.workingSet.combinations.length; i++) {
		this.examineArmorSetCominbation(this.workingSet.combinations[i],i);
	}
	console.log("COMPLETE: mhset.examineEachArmorSetCombination");
}

mhset.examineArmorSetCominbation = function(armorSet, asIndex) {
	var pad = "                              ";
	
	if (armorSet) {
		var div1 = document.createElement("div");
		div1.setAttribute("class","armorRow");
		div1.innerHTML = padRight(asIndex, "       ") + padRight(armorSet.Head, pad) + " " 
			+ padRight(armorSet.Body, pad) + " " 
			+ padRight(armorSet.Arms, pad) + " " 
			+ padRight(armorSet.Waist, pad) + " " 
			+ padRight(armorSet.Legs, pad);
		this.rawoutput.appendChild(div1);
		this.assignSkillPriority(armorSet,asIndex);
		this.createJemSets(armorSet,asIndex);
	}
}

mhset.assignSkillPriority = function(armorSet) {
	/*
	Logic: Assume that the skill with the greatest point deficiency needs to be filled first, then the next, and so on.
	*/
	armorSet.skillPriority = [];
	for (sk in armorSet.targetSkills) {
		armorSet.skillPriority.push(armorSet.targetSkills[sk]);
	}
	armorSet.skillPriority.sort( function(a,b) {return b.JewelPointsRequired - a.JewelPointsRequired;} );

	var div1 = document.createElement("div");
	div1.setAttribute("class","armorRow");
	div1.innerHTML = "       Jewel Points Required: ";
	for (var i = 0; i < armorSet.skillPriority.length; i++) {
		div1.innerHTML += " " + armorSet.skillPriority[i].SkillName + ": " + armorSet.skillPriority[i].JewelPointsRequired;
	}
	this.rawoutput.appendChild(div1);
}

mhset.createJemSets = function(armorSet,asIndex) {
	/*
	Prioritize the highest priority skill need until it is perfectly filled
		- Fill torso first if possible and it doesn't exceed the points required on any given skill.
		- Then fill 3 slots (check if over)
		- Then fill 2 slots (check if over)
		- Then fill 1 slots (check if over)
		- Fill remaining torso slots
	*/
	var JemSet = {};
	JemSet.TorsoRemaining = armorSet.TorsoSlots;
	JemSet.TorsoJems = {};
	JemSet.slot3sRemaining = armorSet.slot3s;
	JemSet.slot2sRemaining = armorSet.slot2s;
	JemSet.slot1sRemaining = armorSet.slot1s;
	JemSet.skillTotals = {};
	for (var tsk in armorSet.targetSkills) {
		JemSet.skillTotals[tsk] = {};
		JemSet.skillTotals[tsk].SkillName = tsk;
		JemSet.skillTotals[tsk].JewelPointsRequired = armorSet.targetSkills[tsk].JewelPointsRequired;
		JemSet.skillTotals[tsk].JewelPointsApplied = 0;
		JemSet.skillTotals[tsk].torsoJewelPoints = 0;
		JemSet.skillTotals[tsk].otherJewelPoints = 0;
		JemSet.skillTotals[tsk].TorsoUps = armorSet.TorsoUps;
		if (JemSet.skillTotals[tsk].JewelPointsRequired == 0) {
			JemSet.activeSkillCount++;
		}
	}
	JemSet.skillPriority = [];
	for (var st in JemSet.skillTotals) {
		JemSet.skillPriority.push(JemSet.skillTotals[st]);
	}
	armorSet.JemSet = JemSet;

	// Start doing something with the JemSet object
	this.sortInitialJemSetSkillPriority(armorSet.JemSet); // always make the skill requiring the most points priority
	this.applyBestInitialTorsoJems(armorSet);
	this.sortJemSetSkillPriority(armorSet.JemSet); // always make the skill requiring the most points priority and the gems that require the most slots is a priority
	this.applyBestJems(armorSet,asIndex);
}

mhset.sortJemSetSkillPriority = function(JemSet) {
	JemSet.skillPriority.sort( function(a,b) {
		var aIncomplete = 0;
		var bIncomplete = 0;

		aIncomplete = (a.JewelPointsApplied >= a.JewelPointsRequired) ? 0 : 1;
		bIncomplete = (b.JewelPointsApplied >= b.JewelPointsRequired) ? 0 : 1;
		if (aIncomplete != bIncomplete) {
			return bIncomplete - aIncomplete;
		}

		var aSlots = 0;
		var bSlots = 0;

		// pick the skill that has the highest minimum slot requirement for its smallest gem.
		if(mhset.workingSet.bestJewels[a.SkillName].singleSlot.SkillPoints) {
			aSlots = 1;
		} else if(mhset.workingSet.bestJewels[a.SkillName].doubleSlot.SkillPoints) {
			aSlots = 2;
		} else if(mhset.workingSet.bestJewels[a.SkillName].tripleSlot.SkillPoints) {
			aSlots = 3;
		}

		if(mhset.workingSet.bestJewels[b.SkillName].singleSlot.SkillPoints) {
			bSlots = 1;
		} else if(mhset.workingSet.bestJewels[b.SkillName].doubleSlot.SkillPoints) {
			bSlots = 2;
		} else if(mhset.workingSet.bestJewels[b.SkillName].tripleSlot.SkillPoints) {
			bSlots = 3;
		}

		if (aSlots != bSlots) {
			return bSlots - aSlots;
		} else {
			// if it is a tie, we just go with skillpoints required
			return b.JewelPointsRequired - a.JewelPointsRequired;
		}
	} );
}

mhset.sortInitialJemSetSkillPriority = function(JemSet) {
	JemSet.skillPriority.sort( function(a,b) {return b.JewelPointsRequired - a.JewelPointsRequired;} );	
}


/*=================================================
 __  .__   __.  __  .___________. __       ___       __      
|  | |  \ |  | |  | |           ||  |     /   \     |  |     
|  | |   \|  | |  | `---|  |----`|  |    /  ^  \    |  |     
|  | |  . `  | |  |     |  |     |  |   /  /_\  \   |  |     
|  | |  |\   | |  |     |  |     |  |  /  _____  \  |  `----.
|__| |__| \__| |__|     |__|     |__| /__/     \__\ |_______|
                                                             
.___________.  ______   .______          _______.  ______    
|           | /  __  \  |   _  \        /       | /  __  \   
`---|  |----`|  |  |  | |  |_)  |      |   (----`|  |  |  |  
    |  |     |  |  |  | |      /        \   \    |  |  |  |  
    |  |     |  `--'  | |  |\  \----.----)   |   |  `--'  |  
    |__|      \______/  | _| `._____|_______/     \______/   
                                                             
       __   _______ .___  ___.      _______.                 
      |  | |   ____||   \/   |     /       |                 
      |  | |  |__   |  \  /  |    |   (----`                 
.--.  |  | |   __|  |  |\/|  |     \   \                     
|  `--'  | |  |____ |  |  |  | .----)   |                    
 \______/  |_______||__|  |__| |_______/                     

=======================================================*/



mhset.applyBestInitialTorsoJems = function(armorSet) {
	console.log ("applyBestTorsoJems");
	if (armorSet.JemSet.TorsoRemaining > 0) {
		var div1 = document.createElement("div");
		div1.setAttribute("class","armorRow");
		div1.innerHTML = "       Attempting to fill " + armorSet.JemSet.TorsoRemaining + " Torso Slots";
		this.rawoutput.appendChild(div1);

		for (var i = 0; i < armorSet.JemSet.skillPriority.length && armorSet.JemSet.TorsoRemaining > 0; i++) {
			this.applyInitialTorsoJemsBySkill(armorSet, armorSet.JemSet.skillPriority[i].SkillName);
		}
	} else {
		var div1 = document.createElement("div");
		div1.setAttribute("class","armorRow");
		div1.innerHTML = "       No remaining torso slots to apply;";
		this.rawoutput.appendChild(div1);
	}
}


mhset.applyInitialTorsoJemsBySkill = function(armorSet, aSkillName) {
	var div1 = document.createElement("div");
	div1.setAttribute("class","armorRow");
	div1.innerHTML = "           " + aSkillName;
	this.rawoutput.appendChild(div1);



	var res = {};
	res.tripleX1 = 0;
	res.doubleX1SingleX1 = 0;
	res.singleX3 = 0;
	res.doubleX1 = 0;
	res.singleX2 = 0;
	res.singleX1 = 0;

	var curBest = {};
	curBest.option = "NONE";
	// we actually don't want anything with more points than is required on torso, so an absurdly high number is used here.
	// Likewise with slot point ratio for determining efficiency.
	curBest.viab = 1000;
	curBest.points = 0;
	curBest.slotPointRatio = 1000;

	var viab = {};
	viab.tripleX1 = -100;
	viab.doubleX1SingleX1 = -100;
	viab.singleX3 = -100;
	viab.doubleX1 = -100;
	viab.singleX2 = -100;
	viab.singleX1 = -100;

	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];


	// Check the viability of any slot combos
	if (asJs.TorsoRemaining == 3) {
		this.checkInitTorsoTripleX1(armorSet, aSkillName, res, viab, curBest);
		this.checkInitTorsoDoubleX1SingleX1(armorSet, aSkillName, res, viab, curBest);
		this.checkInitTorsoSingleX3(armorSet, aSkillName, res, viab, curBest);
	}

	if (asJs.TorsoRemaining >= 2) {
		this.checkInitTorsoDoubleX1(armorSet, aSkillName, res, viab, curBest);
		this.checkInitTorsoSingleX2(armorSet, aSkillName, res, viab, curBest);
	}

	if (asJs.TorsoRemaining >= 1) {
		this.checkInitTorsoSingleX1(armorSet, aSkillName, res, viab, curBest);
	}

	this.setInitialTorsoGemsIntoSlots(armorSet, aSkillName, curBest);
}

mhset.calculateAppliedSkillPoints = function(SkillTotalSet) {
	if (SkillTotalSet) {
		SkillTotalSet.JewelPointsApplied = SkillTotalSet.otherJewelPoints + SkillTotalSet.torsoJewelPoints + (SkillTotalSet.torsoJewelPoints * SkillTotalSet.TorsoUps);
	}
}

mhset.setInitialTorsoGemsIntoSlots = function(armorSet, aSkillName, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (curBest && curBest.option != "NONE" && 	this.workingSet.bestJewels[aSkillName]) {
		switch(curBest.option) {
			case "tripleX1":
				var jem3 = {};
				jem3.skillName = aSkillName;
				jem3.skillPoints = bjSc.tripleSlot.SkillPoints;
				jem3.Jewel = bjSc.tripleSlot.Jewel;
				jem3.qty = 1;
				asJs.TorsoJems[bjSc.tripleSlot.Jewel] = jem3;

				// reduce avail torso slots
				asJs.TorsoRemaining = asJs.TorsoRemaining - 3;

				// add torso points to skillTotal object
				asJsSkt.torsoJewelPoints += bjSc.tripleSlot.SkillPoints;

				break;

			case "doubleX1SingleX1":
				var jem2 = {};
				jem2.skillName = aSkillName;
				jem2.skillPoints = bjSc.doubleSlot.SkillPoints;
				jem2.Jewel = bjSc.doubleSlot.Jewel;
				jem2.qty = 1;
				asJs.TorsoJems[bjSc.doubleSlot.Jewel] = jem2;

				var jem1 = {};
				jem1.skillName = aSkillName;
				jem1.skillPoints = bjSc.singleSlot.SkillPoints;
				jem1.Jewel = bjSc.singleSlot.Jewel;
				jem1.qty = 1;
				asJs.TorsoJems[bjSc.singleSlot.Jewel] = jem1;

				// reduce avail torso slots
				asJs.TorsoRemaining = asJs.TorsoRemaining - 3;

				// add torso points to skillTotal object
				asJsSkt.torsoJewelPoints += bjSc.doubleSlot.SkillPoints + bjSc.singleSlot.SkillPoints ;
				break;

			case "singleX3":
				var jem1 = {};
				jem1.skillPoints = bjSc.singleSlot.SkillPoints;
				jem1.Jewel = bjSc.singleSlot.Jewel;
				jem1.qty = 3;
				asJs.TorsoJems[bjSc.singleSlot.Jewel] = jem1;

				// reduce avail torso slots
				asJs.TorsoRemaining = asJs.TorsoRemaining - 3;

				// add torso points to skillTotal object
				asJsSkt.torsoJewelPoints += bjSc.singleSlot.SkillPoints * 3 ;
				break;

			case "doubleX1":
				var jem2 = {};
				jem2.skillName = aSkillName;
				jem2.skillPoints = bjSc.doubleSlot.SkillPoints;
				jem2.Jewel = bjSc.doubleSlot.Jewel;
				jem2.qty = 1;
				asJs.TorsoJems[bjSc.doubleSlot.Jewel] = jem2;

				// reduce avail torso slots
				asJs.TorsoRemaining = asJs.TorsoRemaining - 2;

				// add torso points to skillTotal object
				asJsSkt.torsoJewelPoints += bjSc.doubleSlot.SkillPoints;
				break;

			case "singleX2":
				var jem1 = {};
				jem1.skillName = aSkillName;
				jem1.skillPoints = bjSc.singleSlot.SkillPoints;
				jem1.Jewel = bjSc.singleSlot.Jewel;
				jem1.qty = 2;
				asJs.TorsoJems[bjSc.singleSlot.Jewel] = jem1;

				// reduce avail torso slots
				asJs.TorsoRemaining = asJs.TorsoRemaining - 2;
				// add torso points to skillTotal object
				asJsSkt.torsoJewelPoints += bjSc.singleSlot.SkillPoints * 2 ;

				break;
			case "singleX1":

				var jem1 = {};
				jem1.skillName = aSkillName;
				jem1.skillPoints = bjSc.singleSlot.SkillPoints;
				jem1.Jewel = bjSc.singleSlot.Jewel;
				jem1.qty = 1;
				asJs.TorsoJems[bjSc.singleSlot.Jewel] = jem1;

				// reduce avail torso slots
				asJs.TorsoRemaining = asJs.TorsoRemaining - 1;
				// add torso points to skillTotal object
				asJsSkt.torsoJewelPoints += bjSc.singleSlot.SkillPoints;
				break;
			default:
				// do nothing
		}

		this.calculateAppliedSkillPoints(asJsSkt);
	}
}


mhset.checkMostEfficientInitialTorsoJems = function(jemArrangement, asJsSkt, res, viab, curBest) {	
	viab[jemArrangement] = asJsSkt.JewelPointsRequired - res[jemArrangement];
	var curSlotPointRatio = this.jemComboSlots[jemArrangement] / res[jemArrangement];

	var msg = "                         " + res[jemArrangement] + "/" + this.jemComboSlots[jemArrangement] + " = " + curSlotPointRatio;
	this.spitOutToDisplay(msg,"armorRow");

	var msg = "                         Viability - (" + viab[jemArrangement] + ")";
	this.spitOutToDisplay(msg,"armorRow");

	// Zero is our sweet spot. Anything that hits zero perfectly filled a skill without going over
	if (viab[jemArrangement] >= 0) {
		this.spitOutToDisplay("                           POSSIBLE CANDIDATE","armorRow");
		if (viab[jemArrangement] == curBest.viab) {
			if (curSlotPointRatio < curBest.slotPointRatio) {
				curBest.option = jemArrangement;
				curBest.viab = viab[jemArrangement];
				curBest.slotPointRatio = curSlotPointRatio;
				curBest.points = res[jemArrangement];
			}
		} else if (viab[jemArrangement] < curBest.viab) {
			// use the one with the lowest point gap.
			curBest.option = jemArrangement;
			curBest.viab = viab[jemArrangement];
			curBest.slotPointRatio = curSlotPointRatio;
			curBest.points = res[jemArrangement];
		}
	}
	else {
		this.spitOutToDisplay("                           DO NOT USE","armorRow");
		// do nothing, use the current curBest options.
	}
	var msg = "                                      " + curBest.option + " P:" + curBest.points + " V:" + curBest.viab + " R:" + curBest.slotPointRatio;
	this.spitOutToDisplay(msg,"armorRow");
}

mhset.checkInitTorsoTripleX1 = function(armorSet, aSkillName, res, viab, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (bjSc
		&& bjSc.tripleSlot.SkillPoints > 0) {

		res.tripleX1 = bjSc.tripleSlot.SkillPoints + (bjSc.tripleSlot.SkillPoints * asJsSkt.TorsoUps)
		var msg = "                Found Triple Slot Jem - " + bjSc.tripleSlot.Jewel + " (" + res.tripleX1 + ")";
		this.spitOutToDisplay(msg,"armorRow");

		this.checkMostEfficientInitialTorsoJems("tripleX1", asJsSkt, res, viab, curBest);

	}
}

mhset.checkInitTorsoDoubleX1SingleX1 = function(armorSet, aSkillName, res, viab, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (bjSc
		&& bjSc.singleSlot.SkillPoints > 0
		&& bjSc.doubleSlot.SkillPoints > 0) {

		var msg = "                Found 2 & 1 Slot Jem combo - " + bjSc.singleSlot.Jewel + " and " + bjSc.doubleSlot.Jewel + " (" + res.doubleX1SingleX1 + ")";;
		this.spitOutToDisplay(msg,"armorRow");

		res.doubleX1SingleX1 = bjSc.doubleSlot.SkillPoints + bjSc.singleSlot.SkillPoints + (bjSc.doubleSlot.SkillPoints + bjSc.singleSlot.SkillPoints) * asJsSkt.TorsoUps;
		this.checkMostEfficientInitialTorsoJems("doubleX1SingleX1", asJsSkt, res, viab, curBest);
	}
}

mhset.checkInitTorsoSingleX3 = function(armorSet, aSkillName, res, viab, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (bjSc
		&& bjSc.singleSlot.SkillPoints > 0) {

		var msg = "                Found 3 x 1 Slot Jems - 3x " + bjSc.singleSlot.Jewel + " (" + res.singleX3 + ")";
		this.spitOutToDisplay(msg,"armorRow");

		res.singleX3 = (bjSc.singleSlot.SkillPoints * 3) + (bjSc.singleSlot.SkillPoints * 3) * asJsSkt.TorsoUps;
		this.checkMostEfficientInitialTorsoJems("singleX3", asJsSkt, res, viab, curBest);

	}
}



mhset.checkInitTorsoDoubleX1 = function(armorSet, aSkillName, res, viab, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (bjSc
		&& bjSc.doubleSlot.SkillPoints > 0) {

		var msg = "                Found Double Slot Jem - " + bjSc.doubleSlot.Jewel + " (" + res.doubleX1 + ")";
		this.spitOutToDisplay(msg,"armorRow");

		res.doubleX1 = bjSc.doubleSlot.SkillPoints + bjSc.doubleSlot.SkillPoints * asJsSkt.TorsoUps;
		this.checkMostEfficientInitialTorsoJems("doubleX1", asJsSkt, res, viab, curBest);

	}
}

mhset.checkInitTorsoSingleX2 = function(armorSet, aSkillName, res, viab, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (bjSc
		&& bjSc.singleSlot.SkillPoints > 0) {

		var msg = "                Found 2 x 1 Slot Jem - " + bjSc.singleSlot.Jewel + " (" + res.singleX2 + ")";
		this.spitOutToDisplay(msg,"armorRow");

		res.singleX2 = (bjSc.singleSlot.SkillPoints * 2) + (bjSc.singleSlot.SkillPoints * 2) * asJsSkt.TorsoUps;
		this.checkMostEfficientInitialTorsoJems("singleX2", asJsSkt, res, viab, curBest);

	}

}

mhset.checkInitTorsoSingleX1 = function(armorSet, aSkillName, res, viab, curBest) {
	var bjSc = this.workingSet.bestJewels[aSkillName];
	var asJs = armorSet.JemSet;
	var asJsSkt = armorSet.JemSet.skillTotals[aSkillName];

	if (bjSc
		&& bjSc.singleSlot.SkillPoints > 0) {

		var msg = "                Found Single Slot Jem - " + bjSc.singleSlot.Jewel + " (" + res.singleX1 + ")";
		this.spitOutToDisplay(msg,"armorRow");

		res.singleX1 = bjSc.singleSlot.SkillPoints  + bjSc.singleSlot.SkillPoints  * asJsSkt.TorsoUps;
		this.checkMostEfficientInitialTorsoJems("singleX1", asJsSkt, res, viab, curBest);
	}
}

/*========================================================================
     ___      .______   .______    __      ____    ____                                        
    /   \     |   _  \  |   _  \  |  |     \   \  /   /                                        
   /  ^  \    |  |_)  | |  |_)  | |  |      \   \/   /                                         
  /  /_\  \   |   ___/  |   ___/  |  |       \_    _/                                          
 /  _____  \  |  |      |  |      |  `----.    |  |                                            
/__/     \__\ | _|      | _|      |_______|    |__|                                            
                                                                                               
     _______.___________.    ___      .__   __.  _______       ___      .______       _______  
    /       |           |   /   \     |  \ |  | |       \     /   \     |   _  \     |       \ 
   |   (----`---|  |----`  /  ^  \    |   \|  | |  .--.  |   /  ^  \    |  |_)  |    |  .--.  |
    \   \       |  |      /  /_\  \   |  . `  | |  |  |  |  /  /_\  \   |      /     |  |  |  |
.----)   |      |  |     /  _____  \  |  |\   | |  '--'  | /  _____  \  |  |\  \----.|  '--'  |
|_______/       |__|    /__/     \__\ |__| \__| |_______/ /__/     \__\ | _| `._____||_______/ 
                                                                                               
  _______  _______ .___  ___.      _______.                                                    
 /  _____||   ____||   \/   |     /       |                                                    
|  |  __  |  |__   |  \  /  |    |   (----`                                                    
|  | |_ | |   __|  |  |\/|  |     \   \                                                        
|  |__| | |  |____ |  |  |  | .----)   |                                                       
 \______| |_______||__|  |__| |_______/                                                        
                                                                                               
=========================================================================*/

mhset.applyBestJems = function(armorSet,asIndex) {
	console.log ("applyBestJems" + asIndex);
	var asJs = armorSet.JemSet;
	if (asJs.slot1sRemaining + asJs.slot2sRemaining + asJs.slot3sRemaining > 0) {
		var msg = "			Filling Slots --- Single:" + asJs.slot1sRemaining + " Double:" + asJs.slot2sRemaining + " Triple:" + asJs.slot3sRemaining;
		this.spitOutToDisplay(msg,"armorRow");

//		for (var i = 0; i < armorSet.JemSet.skillPriority.length && armorSet.JemSet.TorsoRemaining > 0; i++) {
//			this.applyInitialTorsoJemsBySkill(armorSet, armorSet.JemSet.skillPriority[i].SkillName);
//		}
		this.checkViabilityOfJemSet(armorSet);
	} else if ( (asJs.slot1sRemaining + asJs.slot2sRemaining + asJs.slot3sRemaining <= 0 ) && asJs.TorsoRemaining > 0 ) {
		var msg = "			No slots remain, going to fill " + asJs.TorsoRemaining + " torso slots";
		this.spitOutToDisplay(msg,"armorRow");
		this.checkViabilityOfJemSet(armorSet);
	} else {
		var msg = "			No slots remain";
		this.spitOutToDisplay(msg,"armorRow");
		this.checkViabilityOfJemSet(armorSet);
	}

}

mhset.checkViabilityOfJemSet = function(armorSet) {
	console.log ("checkViabilityofJemSet");
	var asJs = armorSet.JemSet;
	var incompleteSkills = 0;
	var totalPointsShort = 0;
	var totalSlotsRemaining = asJs.slot1sRemaining + (asJs.slot2sRemaining * 2) + (asJs.slot3sRemaining * 3) + asJs.TorsoRemaining;
	for (var i = 0; i < asJs.skillPriority.length; i++) {		
		if (asJs.skillPriority[i].JewelPointsRequired > asJs.skillPriority[i].JewelPointsApplied) {
			incompleteSkills++;
			totalPointsShort += asJs.skillPriority[i].JewelPointsRequired - asJs.skillPriority[i].JewelPointsApplied;
		}
	}
	var maxPossiblePointsToJemIn = (totalSlotsRemaining * 2) + (asJs.TorsoRemaining * 2 * armorSet.TorsoUps);

	var msg = "           A total of " + totalPointsShort + " points are required. Only " + totalSlotsRemaining 
			+ " slots are left, assuming " + maxPossiblePointsToJemIn + " more points attainable";
	this.spitOutToDisplay(msg, "armorRow");

	if (incompleteSkills > 0 && maxPossiblePointsToJemIn < totalPointsShort) {

	}
}


/*========================================================================
     ___      .______   .______    __      ____    ____         
    /   \     |   _  \  |   _  \  |  |     \   \  /   /         
   /  ^  \    |  |_)  | |  |_)  | |  |      \   \/   /          
  /  /_\  \   |   ___/  |   ___/  |  |       \_    _/           
 /  _____  \  |  |      |  |      |  `----.    |  |             
/__/     \__\ | _|      | _|      |_______|    |__|             
                                                                
.___________.  ______   .______          _______.  ______       
|           | /  __  \  |   _  \        /       | /  __  \      
`---|  |----`|  |  |  | |  |_)  |      |   (----`|  |  |  |     
    |  |     |  |  |  | |      /        \   \    |  |  |  |     
    |  |     |  `--'  | |  |\  \----.----)   |   |  `--'  |     
    |__|      \______/  | _| `._____|_______/     \______/      
                                                                
  _______  _______ .___  ___.      _______.               ___   
 /  _____||   ____||   \/   |     /       |              |__ \  
|  |  __  |  |__   |  \  /  |    |   (----`    ______       ) | 
|  | |_ | |   __|  |  |\/|  |     \   \       |______|     / /  
|  |__| | |  |____ |  |  |  | .----)   |                  / /_  
 \______| |_______||__|  |__| |_______/                  |____| 
                                                                
=========================================================================*/



mhset.applyRemainingTorsoJemsBySkillTriple = function(armorSet, aSkillName) {

}

mhset.applyRemainingTorsoJemsBySkillDouble = function(armorSet, aSkillName) {
	
}

mhset.applyRemainingTorsoJemsBySkillSingle = function(armorSet, aSkillName) {
	
}







function padRight (str,pad) {
	var newstr = str + "" + pad;
	return newstr.substring(0, pad.length);
}

function padLeft (str,pad) {
	var newstr = pad + "" + str;
	return newstr.substring(newstr.length - pad.length, pad.length);
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

mhset.spitOutToDisplay = function(msg, divClass) {
	var div = document.createElement("div");

	if (divClass) {
		div.setAttribute("class",divClass);
	}
	div.innerHTML = msg;
	this.rawoutput.appendChild(div);
}


removeDescendents = function(node) {
	if (node && node.hasChildNodes() ) {
		while ( node.hasChildNodes() ) {
			removeDescendents(node.firstChild);
			node.removeChild(node.firstChild);
		}
	}
}

















mhset.returnCurIndices = function() {
	var sc = this.workingSet.curIndexes;
	return " Head: " + sc.Head 
		+ " Body: " + sc.Body 
		+ " Arms: " + sc.Arms 
		+ " Waist: " + sc.Waist 
		+ " Legs: " + sc.Legs; 
}






mhset.test = function() {
	mhset.getArmorPiecesByTargetSkills("Blademaster");

	mhset.createExperimentalSets(0,0,0,0,0);


}



