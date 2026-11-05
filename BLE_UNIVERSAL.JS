 ///////////////////////////////////   BLE_Universal.js  ////////////////////////////////////////////////
 //																										//
 //		Shelly xxxxx															    	05/11/2026	    //
 //		------------------			Emplacement:	xxxx												//
 //		192.168.1.xx																					//
 //									Script automatisation sans internet (no cloud)	/version 2			//
 //																										//
 //																										//
 //		process perpétuel > Scanner BLE						Motion - Door - Button - H&T			 	//
 //																										//
 //		Liste Dispositifs SHELLY Bluetooth : ligne 278												 	//
 //																										//
 ///////////////////////////// www. prestazur.fr ///////////////////// - Auteur: DANGEL Sylvain - ////////


	//	REQUETE EXEMPLE
	// ----------------------------------------------------------------------------------------------------
	//	
	//		Shelly.call("HTTP.GET", {url: "http://192.168.1.24/sensor/0"}, function (res, error_code, error_msg, ud) {
	//			if (res.code === 200) {
	//				let resobj = JSON.parse(res.body);
	//				let My_Lumi = resobj.illuminance;
	//			}
	//		});



//////////////////////////////////////////////////////////////////////////////////////////////////
//										V A R I A B L E S										//
//////////////////////////////////////////////////////////////////////////////////////////////////


let Event_Mac;
let Event_Lum;
let On_Motion_Detect = false;
let On_Mov;
let On_Door_Detect = false;
let On_Open;
let On_Clic;

// Durées			// 1H: 3600 sec		30MIN: 1800 sec
// =======
let DUREE = {
	sec_5	:5,
	sec_10	:10,
	min_30	:1800,
	min_45	:2700,
	min_60	:3600,
	h_2		:7200,
};

// Selection durée:
let Duree_Action = DUREE.sec_5;

//////////////////////////////////////////////////////////////////////////////////////////////////
//										F O N C T I O N S										//
//////////////////////////////////////////////////////////////////////////////////////////////////

// ---------------------------------------------------------------------------------------------------
//	RUN URL	
// ----------------------------------------------------------------------------------------------------
function HttpResp(result, error_code, error) { if (error_code != 0) { print("URL action: error"); }}
function Run_URL(a,b,c,d) { Shelly.call("HTTP.GET", {url: "http://192.168.1."+a+"/"+b+"/"+c+"?"+d}, HttpResp); }


// ===================================================================
// 		 Action URL
// 		============
//
function processHttpResponse(result, error_code, error) {
	if (error_code != 0) {
		print("URL action: error");
	} else {
		// print("confirmation URL excutée");
	}
}
function Do_Action(a,b,c,d,e) {
	Shelly.call("HTTP.GET", {url: "http://192.168.1."+a+"/"+b+"/"+c+"?"+d+e}, processHttpResponse)
}
//	-> exemple d'appel:		Do_Action("49","relay","0","turn=toggle","");


//		function onButtonPress(BTHparsed) {
//		  Shelly.emitEvent("BLU_BUTTON", {
//		    addr: BTHparsed.addr,
//		    rssi: BTHparsed.rssi,
//		    Button: BTHparsed.Button,
//		    Battery: BTHparsed.Battery,
//		  });
//		}


function Run_Local(b,c,d) {
//  CONTROL ///////////
print("http://localhost/"+b+"/"+c+"?"+d);
Shelly.call("HTTP.GET", {url: "http://localhost/"+b+"/"+c+"?"+d}, HttpResp); }

//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    B U T T O N									//
//////////////////////////////////////////////////////////////////////////////////////////////////

function ButtonPress(Nb_Clic, Mac_Btn) {

//   =========================== 1	
//   =========  NOIR  ==========    
//   ===========================    
//
	if (Mac_Btn === Btn_Black_1) {
		// print("Btn: Btn_Black_1");
		switch(Nb_Clic){
			case 1:
				print("Btn_Black_1 > clic x1");
				break;
			case 2:
				print("Btn_Black_1 > clic x2");
				break;
			case 3:
				print("Btn_Black_1 > clic x3");
				break;
			case 4:
				print("Btn_Black_1 > clic Long");
				break;
		}
	}

//   =========================== 2	
//   =========  NOIR  ==========    
//   ===========================    
//
	if (Mac_Btn === Btn_Black_2) {
		// print("Btn: Btn_Black_2");
		switch(Nb_Clic){
			case 1:
				print("Btn_Black_2 > clic x1");
				break;
			case 2:
				print("Btn_Black_2 > clic x2");
				break;
			case 3:
				print("Btn_Black_2 > clic x3");
				break;
			case 4:
				print("Btn_Black_2 > clic Long");
				break;
		}
	}

//   =========================== 3	(version T)
//   =========  NOIR  ==========    
//   ===========================    
//
	if (Mac_Btn === Btn_T_Black_1) {
		// print("Btn: Btn_T_Black_1");
		switch(Nb_Clic){
			case 1:
				print("Btn_T_Black_1 > clic x1");
				print("lustre couloir OFF");
				Shelly.call("Switch.Set", { id: 0, on: false });
				break;
			case 2:
				print("Btn_T_Black_1 > clic x2");
				break;
			case 3:
				print("Btn_T_Black_1 > clic x3");
				break;
			case 4:
				print("Btn_T_Black_1 > clic Long");
				break;
		}
	}


//   ===========================
//   =========  ROUGE  =========    
//   ===========================    
//
	if (Mac_Btn === Btn_Red) {
		// print("Btn: Btn_Red");
		switch(Nb_Clic){
			case 1:
				print("Btn_Red > clic x1");
				break;
			case 2:
				print("Btn_Red > clic x2");
				break;
			case 3:
				print("Btn_Red > clic x3");
				break;
			case 4:
				print("Btn_Red > clic Long");
				break;
		}
	}

//   =========================== 1 	
//   =========  BLANC  =========    
//   ===========================    
//	
	if (Mac_Btn === Btn_White_1) { 
		// print("Btn: Btn_White_1");
		switch(Nb_Clic){
			case 1:
				print("Btn_White_1 CE > clic x1");
				break;
			case 2:
				print("Btn_White_1 > clic x2");
				break;
			case 3:
				print("Btn_White_1 > clic x3");
				break;
			case 4:
				print("Btn_White_1 > clic Long");
				break;
		}
	}

//   =========================== 2 	
//   =========  BLANC  =========    
//   ===========================    
//	
	if (Mac_Btn === Btn_White_2) { 
		// print("Btn: Btn_White_2");
		switch(Nb_Clic){
			case 1:
				print("Btn_White_2 SDB > clic x1");
				break;
			case 2:
				print("Btn_White_2 > clic x2");
				break;
			case 3:
				print("Btn_White_2 > clic x3");
				break;
			case 4:
				print("Btn_White_2 > clic Long");
				break;
		}
	}

//   =========================== 3 
//   =========  BLANC  =========    
//   ===========================    
//	
	if (Mac_Btn === Btn_White_3) { 
		// print("Btn: Demo");
		switch(Nb_Clic){
			case 1:
				print("Btn_Sono > clic x1");
				break;
			case 2:
				print("Btn_Sono > clic x2");
				break;
			case 3:
				print("Btn_Sono > clic x3");
				break;
			case 4:
				print("Btn_Sono > clic Long");
				break;
		}
	}

}



//////////////////////////////////////////////////////////////////////////////////////////////////
//									P A R A M E T R E S											//
//////////////////////////////////////////////////////////////////////////////////////////////////

// Paramètre durée
// ================
let Delai_Stop_1			= "20";		//	(secondes)


//		# ============================== #   (utile pour dupliquer ce script)
//		#  Dispositifs SHELLY Bluetooth  #
//		# ============================== #

let Btn_Black_1		=	"90:ab:96:3c:95:2f";	//	  Demo
let Btn_Black_2		=	"b4:35:22:f5:15:36";	//	  Demo
let Btn_T_Black_1	=	"7c:c6:b6:71:eb:4d";	//  bip porte clé Madame
let Btn_Red			=	"90:ab:96:3d:60:e2";	//	radiateur chambre
let Btn_White_1		=	"5c:c7:c1:f6:40:3b";	//	(eau-chaude)
let Btn_White_2		=	"28:76:81:f9:69:81";	//	(SDB)
let Btn_White_3		=	"b0:c7:de:be:2a:8a";	//	  Demo
let Btn_White_4		=	"7c:c6:b6:64:eb:99";	//	  Demo 
let Btn_T_White_1	=	"7c:c6:b6:72:16:c5";	//  bip porte clé Monsieur
let Door_1			=	"60:ef:ab:42:ef:f8";	//	Terrasse
let Door_2			=	"8c:6f:b9:0b:56:33";	//	penderie couloir
let Door_3			=	"60:ef:ab:44:24:a3";	//	ouverture frigo
let Door_4			=	"b0:c7:de:40:4f:4b";	//	tiroir couloir
let Door_5			=	"b0:c7:de:3e:7c:28";	//	  Demo 1
let Door_6			=	"e8:e0:7e:cb:bd:52";	//	  Demo 2  POUR Terrasse
let Door_7			=	"b0:c7:de:06:0c:80";	//	Porte d'entrée
let Motion_1		=	"3c:2e:f5:a8:c9:71";	//	Porte d'entrée
let Motion_2		=	"38:39:8f:70:f3:ff";	//	  Demo


//		Dispositifs concernés par ce script  (décommenter pour activer)

let CONFIG = {
	debug: true,
	active: true,

    allowedMacAddresses: [
		Btn_Black_1,
		Btn_Black_2,
//		Btn_T_Black_1,
		Btn_Red,
//		Btn_White_1,
//		Btn_White_2,
//		Btn_White_3,  
		Btn_White_4,
		Btn_T_White_1,
//		Door_1,
		Door_2,
		Door_3,
		Door_4,
//		Door_5,
		Door_6,
		Door_7,
//		Motion_1,
//		Motion_2,
	],


	//  Concerne: MOTION //
	//  ===================
	motionHandler: function (motion, eventData) {
		// se produit seulement au changement entre les états : move / no-move

		On_Motion_Detect = true;
		On_Mov = motion;		//	(Etat du mouvement)

		//		if (On_Mov === true) { 
		//			console.log("New Move");		}
		//		else { 
		//			console.log("No more Mov");		}
	},


	//  Concerne: tout matériel gérant la luminosité //
	//  ===============================================
	//  
	illuminanceHandler: function (illuminance, eventData) {		
		// --------------------------------------------------- Luminosité	
		Event_Lum = illuminance;
		// console.log("Luminosité gérée (", Event_Lum,")");

		// --------------------------------------------------- identification (Mac)			
		Event_Mac = eventData.address;
		// console.log("MAC (", Event_Mac,")");
	},



///////////   NOUVEAU SIGNAL   //////////////////////////////////////////////////////////////////////////
	onStatusUpdate: function (eventData) {

////////////////////////////////////////////////////////////////////////////////////////////////////////

		// console.log(Event_Mac);


		// Door check //
		On_Open = eventData.window;			// Etat ouverture:  1 -> Ouvert  ,  0 -> Fermé
		if (On_Open !== undefined) {
			On_Door_Detect = true;
		}


//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    D O O R										//
//////////////////////////////////////////////////////////////////////////////////////////////////

		if (On_Door_Detect === true) {
			// print("Type module = Door");


			//   =========================== 1  (Terrasse)
			//   =========  DOOR 1  ========    
			//   ===========================    
			//	
			if (Event_Mac === Door_6) { 
				// print("Door: Terrasse");
				switch(On_Open){
					case 1:
						console.log("Ouverture de la terrasse (luminosité:",Event_Lum,")");
						// allumer la lumière (action remote) 
						//  (l'ip du dispositif cible doit être fixe, de préférence à parametrer sur le routeur)
						
						if (Event_Lum <= 10) { 
							console.log("Terrasse sombre: Allumer le lustre");
							// allumer la lumière (action remote)
							// Shelly.call("HTTP.GET", {url: "http://192.168.10.55/light/0?turn=on"}, processHttpResponse)
							Shelly.call("HTTP.GET", {url: "http://192.168.1.55/light/0?turn=on&timer=30"}, processHttpResponse)
						}
						break;
					case 0:
						print("Terrasse: Fermeture");
						Shelly.call("HTTP.GET", {url: "http://192.168.1.55/light/0?turn=off"}, processHttpResponse);
						break;
				}
			}

			//   =========================== 2  (Penderie)
			//   =========  DOOR 2  ========    
			//   ===========================    
			//	
			if (Event_Mac === Door_2) { 
				// print("Door: Penderie");
				switch(On_Open){
					
					// Ouverture
					case 1:
						print("Penderie: Ouverture");
						// Buid-in relay > ON   (allumer lustre couloir)
				        Shelly.call("Switch.Set", { id: 0, on: true });		// Response: "was_on"
						break;
					
					// Fermeture
					case 0:
						print("Penderie: Fermeture");
						// position interrupteur ? 
						let status = Shelly.getComponentStatus("input", 0);
						let Is_ON = status.state;

						if (Is_ON === false) {
							// Interrupteur est sur OFF > éteindre
							Shelly.call("Switch.Set", { id: 0, on: false });			// (build-in cmd)
							print("inter OFF > Lustre OFF");
						}
						break;
						
				}
			}

			//   =========================== 3  (Frigo)
			//   =========  DOOR 3  ========    
			//   ===========================    
			//	
			if (Event_Mac === Door_3) { 
				// print("Door: Frigo");
				switch(On_Open){
					
					// Ouverture
					case 1:
						console.log("Ouverture du Frigo (luminosité:",Event_Lum,")");
						// (ACTION: Allumer éclairage cuisine)
					
						if (Event_Lum <= 7) { 
							console.log("Cuisine sombre: Allumer la Lumière de la cuisine");
							// allumer la lumière (action remote)
							Shelly.call("HTTP.GET", {url: "http://192.168.1.41/relay/3?turn=on"}, processHttpResponse)
						}
						break;
					
					// Fermeture
					case 0:
						print("Fermeture du frigo");
						
						let Is_On = null; // on initialise toujours la variable
						
						// Cuisine interrupteur ON-OFF  ? -------------------------------------
						Shelly.call("HTTP.GET", {url: "http://192.168.1.41/rpc/Input.GetStatus?id=3"}, function (res, error_code, error_msg, ud) {
							
								// 1) check IsOn
								print("check IsOn (461)");
								if (res.code === 200) {
									let resobj = JSON.parse(res.body);
									Is_On = resobj.state;
								
						
								// 2) IsOn = true
								if (Is_On === true) {
									print("interrupteur en position ON (laisser allumé)");
								}
								else {
									print("interrupteur en position OFF: éteindre");
									// éteindre la lumière (action remote)
									Shelly.call("HTTP.GET", {url: "http://192.168.1.41/relay/3?turn=off"}, processHttpResponse)
								}
								}
							}	
						);
						// -------------------------------------------------------------------					
						
						break;
				}
			}


			//   =========================== 4  (Tiroir)
			//   =========  DOOR 4  ========    
			//   ===========================    
			//
			if (Event_Mac === Door_4) { 
				// print("Door: Tiroir");
				switch(On_Open){
					
					// Ouverture
					case 1:
						print("Tiroir: Ouverture");
						// Buid-in relay > ON   (allumer lustre couloir)
						Shelly.call("Switch.Set", { id: 0, on: true });	
						break;
					
					// Fermeture
					case 0:
						print("Tiroir: Fermeture");
						// position interrupteur ? 
						let status = Shelly.getComponentStatus("input", 0);
						let Is_ON = status.state;

						if (Is_ON === false) {
							// Interrupteur est sur OFF > éteindre
							Shelly.call("Switch.Set", { id: 0, on: false });			// (build-in cmd)
							print("inter OFF > Lustre OFF");
						}	
						break;		

				}
			}
			
			//   =========================== 7  (Porte Entrée)
			//   =========  DOOR 7  ========    
			//   ===========================    
			//
			if (Event_Mac === Door_7) { 
				// print("Door: Porte Entrée");
				switch(On_Open){
					case 1:
						console.log("Ouverture de la porte d'entrée (luminosité:",Event_Lum,")");
						// (ACTION: Allumer le couloir)
					
						if (Event_Lum <= 15) { 
							console.log("Entrée sombre (- de 30): Allumer la Lumière du couloir");
							// allumer la lumière 
							// Shelly.call("Switch.Set", { id: 0, on: true });			// (build-in cmd)
						}
						break;
						
					case 0:
						print("Porte Entrée: Fermeture");
						// position interrupteur ? 
						let status = Shelly.getComponentStatus("input", 0);
						let Is_ON = status.state;

						if (Is_ON === false) {
							// Interrupteur est sur OFF > éteindre
							Shelly.call("Switch.Set", { id: 0, on: false });			// (build-in cmd)
							print("inter OFF > Lustre OFF");
						}	
						break;
				}
			}


		}



//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    M O T I O N									//
//////////////////////////////////////////////////////////////////////////////////////////////////

		if (On_Motion_Detect === true) { 
			// print("Type module = Motion");

			//   ===========================  Couloir
			//   =========  MOTION  ========    
			//   ===========================    
			//	
			if (Event_Mac === Motion_1) { 
				// print("Mouvement dans l'Entrée");

				switch(On_Mov){
					case true:
						print("Entrée: New Move");
						break;
					case false:
						print("Entrée: No more Move");
						break;
				}
			}


		}


//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    M A C											//
//////////////////////////////////////////////////////////////////////////////////////////////////
		

	//  (pour test)
		
	//		if (Event_Mac === "b0:c7:de:40:4f:4b") { 
	//			 print("Equipement détecté: Tiroir couloir");
	//		}
    //	
	//		if (Event_Mac === "8c:6f:b9:0b:56:33") { 
	//			print("Equipement détecté: penderie couloir");
	//		}
	//	
	//		if (Event_Mac === "60:ef:ab:44:24:a3") { 
	//			print("Equipement détecté: frigo");	
	//		}	


	}

};



//////////////////////////////////////////////////////////////////////////////////////////////////
//										P R O G R A M M E										//
////////////////////////////////////////////////////////////////////////////////////////////////// 

//   ne pas modifier tout ce qui suit ci-dessous  //


let ALLTERCO_MFD_ID_STR = "0ba9";
let BTHOME_SVC_ID_STR = "fcd2";

let uint8 = 0;
let int8 = 1;
let uint16 = 2;
let int16 = 3;
let uint24 = 4;
let int24 = 5;

//Logs the provided message with an optional prefix to the console.
function logger(message, prefix) {
  //exit if the debug isn't enabled
  if (!CONFIG.debug) {
    return;
  }

  let finalText = "";

  //if the message is list loop over it
  if (Array.isArray(message)) {
    for (let i = 0; i < message.length; i++) {
      finalText = finalText + " " + JSON.stringify(message[i]);
    }
  } else {
    finalText = JSON.stringify(message);
  }

  //the prefix must be string
  if (typeof prefix !== "string") {
    prefix = "";
  } else {
    prefix = prefix + ":";
  }

  //log the result
  console.log(prefix, finalText);
}

// The BTH object defines the structure of the BTHome data
let BTH = {};
BTH[0x00] = { n: "pid", t: uint8 };
BTH[0x01] = { n: "battery", t: uint8, u: "%" };
BTH[0x02] = { n: "temperature", t: int16, f: 0.01, u: "tC" };
BTH[0x03] = { n: "humidity", t: uint16, f: 0.01, u: "%" };
BTH[0x05] = { n: "illuminance", t: uint24, f: 0.01 };
BTH[0x21] = { n: "motion", t: uint8 };
BTH[0x2d] = { n: "window", t: uint8 };
BTH[0x3a] = { n: "button", t: uint8 };
BTH[0x3f] = { n: "rotation", t: int16, f: 0.1 };

function getByteSize(type) {
  if (type === uint8 || type === int8) return 1;
  if (type === uint16 || type === int16) return 2;
  if (type === uint24 || type === int24) return 3;
  //impossible as advertisements are much smaller;
  return 255;
}

// functions for decoding and unpacking the service data from Shelly BLU devices
let BTHomeDecoder = {
  utoi: function (num, bitsz) {
    let mask = 1 << (bitsz - 1);
    return num & mask ? num - (1 << bitsz) : num;
  },
  getUInt8: function (buffer) {
    return buffer.at(0);
  },
  getInt8: function (buffer) {
    return this.utoi(this.getUInt8(buffer), 8);
  },
  getUInt16LE: function (buffer) {
    return 0xffff & ((buffer.at(1) << 8) | buffer.at(0));
  },
  getInt16LE: function (buffer) {
    return this.utoi(this.getUInt16LE(buffer), 16);
  },
  getUInt24LE: function (buffer) {
    return (
      0x00ffffff & ((buffer.at(2) << 16) | (buffer.at(1) << 8) | buffer.at(0))
    );
  },
  getInt24LE: function (buffer) {
    return this.utoi(this.getUInt24LE(buffer), 24);
  },
  getBufValue: function (type, buffer) {
    if (buffer.length < getByteSize(type)) return null;
    let res = null;
    if (type === uint8) res = this.getUInt8(buffer);
    if (type === int8) res = this.getInt8(buffer);
    if (type === uint16) res = this.getUInt16LE(buffer);
    if (type === int16) res = this.getInt16LE(buffer);
    if (type === uint24) res = this.getUInt24LE(buffer);
    if (type === int24) res = this.getInt24LE(buffer);
    return res;
  },

  // Unpacks the service data buffer from a Shelly BLU device
  unpack: function (buffer) {
    //beacons might not provide BTH service data
    if (typeof buffer !== "string" || buffer.length === 0) return null;
    let result = {};
    let _dib = buffer.at(0);
    result["encryption"] = _dib & 0x1 ? true : false;
    result["BTHome_version"] = _dib >> 5;
    if (result["BTHome_version"] !== 2) return null;
    //can not handle encrypted data
    if (result["encryption"]) return result;
    buffer = buffer.slice(1);

    let _bth;
    let _value;
    while (buffer.length > 0) {
      _bth = BTH[buffer.at(0)];
      if (typeof _bth === "undefined") {
        logger("unknown type", "BTH");
        break;
      }
      buffer = buffer.slice(1);
      _value = this.getBufValue(_bth.t, buffer);
      if (_value === null) break;
      if (typeof _bth.f !== "undefined") _value = _value * _bth.f;
      result[_bth.n] = _value;
      buffer = buffer.slice(getByteSize(_bth.t));
    }
    return result;
  },
};

function onReceivedPacket (data) {
  if(CONFIG._processedMacAddresses !== null) { 
    if(CONFIG._processedMacAddresses.indexOf(data.address) < 0) {
		// logger(["Not Allowed ", data.address], "Mac");
		console.log("Not Good Mac"); 
      return;
    }
  }

  if (
    typeof CONFIG.motionHandler === "function" &&
    typeof data.motion !== "undefined"
  ) {
    CONFIG.motionHandler(data.motion === 1, data);
    // logger("Motion handler called", "Info");   //////////////////////
  }

  if (
    typeof CONFIG.illuminanceHandler === "function" &&
    typeof data.illuminance !== "undefined"
  ) {
    CONFIG.illuminanceHandler(data.illuminance, data);
    // logger("Illuminance handler called", "Info");  /////////////////
  }

  if (typeof CONFIG.onStatusUpdate === "function") {
    CONFIG.onStatusUpdate(data);
    // logger("New status update", "Info");  //////////////////////

	let Device_Mac = data.address;
	// print(data.address);


	// Detect type Button
	let Read_Button = data.button;
	if (Read_Button !== undefined) {
		ButtonPress(Read_Button, Device_Mac);
	}

	
//   addr: BTHparsed.addr,
//   rssi: BTHparsed.rssi,
//   Button: BTHparsed.Button,
//   Battery: BTHparsed.Battery,





  }
}

//saving the id of the last packet, this is used to filter the duplicated packets
let lastPacketId = 0x100;

// Callback for the BLE scanner object
function BLEScanCallback(event, result) {
  //exit if not a result of a scan
  if (event !== BLE.Scanner.SCAN_RESULT) {
    return;
  }

  //exit if service_data member is missing
  if (
    typeof result.service_data === "undefined" ||
    typeof result.service_data[BTHOME_SVC_ID_STR] === "undefined"
  ) {
    return;
  }

  let unpackedData = BTHomeDecoder.unpack(
    result.service_data[BTHOME_SVC_ID_STR]
  );

  //exit if unpacked data is null or the device is encrypted
  if (
    unpackedData === null ||
    typeof unpackedData === "undefined" ||
    unpackedData["encryption"]
  ) {
    logger("Encrypted devices are not supported", "Error");
    return;
  }

  //exit if the event is duplicated
  if (lastPacketId === unpackedData.pid) {
    return;
  }

  lastPacketId = unpackedData.pid;

  unpackedData.rssi = result.rssi;
  unpackedData.address = result.addr;

  onReceivedPacket(unpackedData);
}

// Initializes the script and performs the necessary checks and configurations
function init() {
  //exit if can't find the config
  if (typeof CONFIG === "undefined") {
    console.log("Error: Undefined config");
    return;
  }

  //get the config of ble component
  let BLEConfig = Shelly.getComponentConfig("ble");

  //exit if the BLE isn't enabled
  if (!BLEConfig.enable) {
    console.log(
      "Error: The Bluetooth is not enabled, please enable it from settings"
    );
    return;
  }

  //check if the scanner is already running
  if (BLE.Scanner.isRunning()) {
    // console.log("BLE scan is running");
  }
  else {
    //start the scanner
    let bleScanner = BLE.Scanner.Start({
        duration_ms: BLE.Scanner.INFINITE_SCAN,
        active: CONFIG.active
    });

    if(!bleScanner) {
      console.log("Error: Can not start new scanner");
    }
  }

  if (
    typeof CONFIG.allowedMacAddresses !== "undefined"
  ) {
    if(CONFIG.allowedMacAddresses !== null) {
      // Process configured mac addresses all to lower case and remove duplicates. 
      CONFIG._processedMacAddresses = 
        CONFIG
          .allowedMacAddresses
          .map(function (mac) { return mac.toLowerCase(); })
          .filter(function (value, index, array) { return array.indexOf(value) === index; })
    }
    else {
      CONFIG._processedMacAddresses = null;
    }
  }

  //subscribe a callback to BLE scanner
  BLE.Scanner.Subscribe(BLEScanCallback);
  console.log("Scanner démarré (Entrée)");
}

init();