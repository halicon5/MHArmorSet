var mhset = {};

mhset.initialize = function() {
	console.log("CALL: mhset.initialize();");
	mhset.dbconnect();
	console.log("COMPLETE: mhset.initialize();");	
}

mhset.createImportRowArray = function(dat, keyCol) {
	console.log("CALL: mhset.createImportRowArray " + dat + " " + keyCol);
	if (dat && keyCol) {
		var rowArray = []
		var i = 0;
		for (var k in dat) {
			rowObj = {};
			rowObj[keyCol] = k;
			rowArray[i] = rowObj;
			for (var subK in dat[k]) {
				rowObj[subK] = dat[k][subK];
			}
			i++;
		}
		return rowArray;
	} else {
		alert('createImportRowArray failed for ' + keyCol)
	}
	console.log("COMPLETE: mhset.createImportRowArray " + dat + " " + keyCol);
}

mhset.createSchema = function() {
	console.log("CALL: mhset.createSchema");


	console.log("CALL: mhset.createSchema SkillMstr");
	this.schemaBuilder.createTable("SkillMstr").
		addColumn("skmId",lf.Type.INTEGER).
		addColumn("SkillName",lf.Type.STRING).
	    addPrimaryKey(['skmId'],true).
	    addIndex('idxSkillName',['SkillName'], false, lf.Order.ASC);

	console.log("CALL: mhset.createSchema ArmorPieces");
	this.schemaBuilder.createTable("ArmorPieces").
		addColumn("apId",lf.Type.INTEGER).
		addColumn("ArmorPiece",lf.Type.STRING).
		addColumn("Slots",lf.Type.STRING).
		addColumn("SlotCount",lf.Type.INTEGER).
		addColumn("SetName",lf.Type.STRING).
		addColumn("Rarity",lf.Type.INTEGER).
		addColumn("Part",lf.Type.STRING).
		addColumn("HunterType",lf.Type.STRING).
		addColumn("MinDef",lf.Type.INTEGER).
		addColumn("MaxDef",lf.Type.INTEGER).
		addColumn("Fire",lf.Type.INTEGER).
		addColumn("Water",lf.Type.INTEGER).
		addColumn("Ice",lf.Type.INTEGER).
		addColumn("Thunder",lf.Type.INTEGER).
		addColumn("Dragon",lf.Type.INTEGER).
	    addPrimaryKey(['apId'],true).
	    addIndex('idxArmorPiece',['ArmorPiece'], false, lf.Order.ASC);

	console.log("COMPLETE: mhset.createSchema");
}

mhset.dbconnect = function() {
	console.log("CALL: mhset.dbconnect");

	this.schemaBuilder = lf.schema.create('monhunArms','1.001');

	this.schemaBuilder.connect().then(function(db) {
		console.log("CALL: mhset.dbconnect -> this.schemaBuilder.connect().then");
		mhset.db = db;
		mhset.initializeDB();
		console.log("COMPLETE: mhset.dbconnect -> this.schemaBuilder.connect().then");
	});
	console.log("COMPLETE: mhset.dbconnect");
}


mhset.loadDB = function(db) {
	var	tblArmorPieces = db.getSchema().table('ArmorPieces');
	var datArmorPieces = mhset.createImportRowArray(mhsetArmorPieces,'ArmorPiece');

	var rows = [];
	for (var i = 0; i < datArmorPieces.length; i++) {
		rows[i] = tblArmorPieces.createRow(datArmorPieces[i]);
	}

	db.insertOrReplace().into(tblArmorPieces).values(rows).exec();		
}

/*
	).then(function() {
		return monHunArmsDB.select().from(itmArmorPieces).orderBy(itmArmorPieces.ArmorPiece).exec();
	}).then(function(results) {
		results.forEach(function(row) {
			console.log(row['ArmorPiece'], ',', row['Slots'], row['apId']);
		});
	)}
}
*/


mhset.clearDB = function(db) {
	console.log("CALL: mhset.clearDB");
	var tblArmorPieces = db.getSchema().table("ArmorPieces");
	db.delete().from(tblArmorPieces).exec();
	console.log("COMPLETE: mhset.clearDB");
}

mhset.initializeDB = function() {
	console.log("CALL: mhset.initializeDB");
	this.createSchema();
	this.clearDB(this.db);
	this.loadDB(this.db);
	console.log("COMPLETE: mhset.initializeDB");
}

