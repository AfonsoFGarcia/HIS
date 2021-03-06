CREATE TABLE IF NOT EXISTS LOC(
	ID INTEGER PRIMARY KEY ASC,
	DSC TEXT
);
CREATE TABLE IF NOT EXISTS TIP(
	ID INTEGER PRIMARY KEY ASC,
	DSC TEXT
);
CREATE TABLE IF NOT EXISTS STP(
	ID INTEGER PRIMARY KEY ASC,
	TIP INTEGER,
	DSC TEXT,
	FOREIGN KEY(TIP) REFERENCES TIP(ID)
);
CREATE TABLE IF NOT EXISTS MAR(
	ID INTEGER PRIMARY KEY ASC,
	DSC TEXT
);
CREATE TABLE IF NOT EXISTS ART(
	ID INTEGER PRIMARY KEY ASC,
	LOC INTEGER,
	TIP INTEGER,
	STP INTEGER,
	MAR INTEGER,
	DSC TEXT,
	FOREIGN KEY(LOC) REFERENCES LOC(ID),
	FOREIGN KEY(TIP, STP) REFERENCES STP(TIP, ID),
	FOREIGN KEY(MAR) REFERENCES MAR(ID)
);
