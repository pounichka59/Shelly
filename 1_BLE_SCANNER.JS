//		http://192.168.1.x
//		C:\Users\fox\Desktop\shelly\_script\_PROD_\xxx.js				M O D E L E

 //////////////////////////////////////////////   xxx.js  ////////////////////////////////////////////////
 //																										//
 //		Shelly xxxxx																	01/01/2026		//
 //		------------------			Emplacement:	xxxx												//
 //		192.168.1.xx																					//
 //									Script automatisation sans internet (no cloud)						//
 //																										//
 //																										//
 //		process perpétuel > Scanner BLE						Motion - Door - Button - H&T			 	//
 //																										//
 ///////////////////////////// www. prestazur.fr ///////////////////// - Auteur: DANGEL Sylvain - ////////

	//  Dispositifs SHELLY Bluetooth:	Ligne 255
 
//////////////////////////////////////////////////////////////////////////////////////////////////
//										V A R I A B L E S										//
//////////////////////////////////////////////////////////////////////////////////////////////////

// Durées	
// =======				 1H: 3600 sec		30MIN: 1800 sec
let DUREE = {
	sec_5	:5,
	min_1	:60,
	min_30	:1800,
	min_60	:3600,
	h_2		:7200,
};

// Selection durée:
let Duree_Action = DUREE.min_30;

// Timers
// ======
let TIMER = {
	t1: DUREE.min_30,		
	t2: DUREE.min_1,
};

let Event_Mac;
let Event_Lum;
let On_Motion;
let On_Open;
let On_Motion_Detect = false;
let On_Open_Detect = false;

let Is_On;


//////////////////////////////////////////////////////////////////////////////////////////////////
//										F O N C T I O N S										//
//////////////////////////////////////////////////////////////////////////////////////////////////

// ---------------------------------------------------------------------------------------------------
//	RUN URL	
// ----------------------------------------------------------------------------------------------------
function HttpResp(result, error_code, error) { if (error_code != 0) { print("URL action: error"); }}
function Run_URL(a,b,c,d) {
	let Ip_Device;
	if (a === "0") Ip_Device = "localhost";
	else Ip_Device = "192.168.1."+a;
	Shelly.call("HTTP.GET", {url: "http://"+Ip_Device+"/"+b+"/"+c+"?"+d}, HttpResp); }
function Run_URL_Full(The_Url) {
	Shelly.call("HTTP.GET", {url: The_Url}, HttpResp); }
function Run_Local(c,d) { Shelly.call("Switch.Set", { id: c, d }); }

// ----------------------------------------------------------------------------------------------------
//	Auto-Stop							Job_Done();
// ----------------------------------------------------------------------------------------------------	
// Nb de jobs avant l'arret du script:
let Total_Jobs = 2;	//  << param

let Script_Job = 0;
function Job_Done() {
	Script_Job ++;
	print("completed ",Script_Job,"/",Total_Jobs);
	if (Script_Job === Total_Jobs) {
		Auto_Stop();
	}
}
function Auto_Stop() { Shelly.call("Script.Stop", {'id': CONFIG.Script_Number}); }

// ----------------------------------------------------------------------------------------------------
//	Flash Light							StartFlash(2, "any", "56","relay","0");	
// ----------------------------------------------------------------------------------------------------	 
//					Nb On+Off  -  Start from: on-off-any  -  IP device  -  type device  -  channel
//
let Speed_Flash 	= 400;		// (paramètre)

let Timer_Flash 	= null;
let Tour_Flash 		= 0;
let Nb_Switch;
let URL_Target;

function stopTimer() { Timer.clear(Timer_Flash); }
function StartFlash(Nb_Flash, First_Flash, IP_Target, Typ_Target, Ch_Target) {
	Tour_Flash ++;
		// valable uniquement au 1er tour
		if (Nb_Flash != null) {
			Nb_Switch = (Nb_Flash *2);
			URL_Target = "http://192.168.1."+IP_Target+"/"+Typ_Target+"/"+Ch_Target+"?turn=toggle";
			if ( (First_Flash === "on") || (First_Flash === "off") )  {
				// First position > ON / OFF
				let First_Url = "http://192.168.1."+IP_Target+"/"+Typ_Target+"/"+Ch_Target+"?turn="+First_Flash;
				Shelly.call("HTTP.GET", {url: First_Url}, HttpResp);
			}
			else {
				// First position > Toggle
				Shelly.call("HTTP.GET", {url: URL_Target}, HttpResp);
			}
		}
		// valable du second tour jusqu'au dernier
		else {
			Shelly.call("HTTP.GET", {url: URL_Target}, HttpResp);
		}
	
	Timer_Flash = Timer.set(Speed_Flash,false,StartFlash,null);
	if (Tour_Flash === Nb_Switch) {
		Tour_Flash = 0;
		stopTimer();
	}
}
// ----------------------------------------------------------------------------------------------------

	// ----------------------------------------------------------------------------------------------------
	//	RUN URL
	// ----------------------------------------------------------------------------------------------------
	//	Remote:		Shelly.call("HTTP.GET", {url: "http://192.168.1.56/relay/0"}, HttpResp);
	//	local:		Shelly.call("Switch.Set", { id: 0, on: false });
	//
	//	/funct:		Run_URL("56","relay","0","turn=toggle");			// IP for localhost: 0
	//				Run_Local(0, "on: true, toggle_after: 10");			// channel, command(s)
	//				  let Full_Url = "http.......";
	//				Run_URL_Full(Full_Url);
	//
	// ----------------------------------------------------------------------------------------------------
	//	REQUETE
	// ----------------------------------------------------------------------------------------------------	
	//
	//		 // Remote relay:
	//			--------------
	//		let Is_On;  // Déclaration globale à la fonction
	//		Shelly.call("HTTP.GET", {"url": "http://192.168.1.56/relay/0"}, function (response) {
	//			if (response.code === 200) {	let resobj 	= JSON.parse(response.body);
	//											Is_On 	= resobj.ison;								
	//				// Action
	//				if (Is_On === false) {	}		//	(for buid-in relay: "http://localhost/....  )
	//		}});
	//
	//		 // buid-in relay:
	//			--------------
	//		let status = Shelly.getComponentStatus("switch", 2);	// (Lustre séjour)
	//		let Is_On = status.output;
	//		if (Is_On === true) {
	//			print("Is On: (",Is_On,")");
	//		}	
	//
	// ----------------------------------------------------------------------------------------------------


//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    B U T T O N									//
//////////////////////////////////////////////////////////////////////////////////////////////////

function ButtonPress(Nb_Clic, Mac_Btn) {

	print("bouton:"+Mac_Btn);

//   ==========================  Black 1
//   =======  Button  =========    
//   ==========================
//
	if (Mac_Btn === Btn_Black_1) {
		switch(Nb_Clic){
			case 1:
				print("Black_1 x1");
				break;
			case 2:
				print("Black_1 x2");
				break;
			case 3:
				print("Black_1 x3");
				break;
			case 4:
				print("Black_1 Long");
				break;
		}
	}
	
//   ==========================  Black 2
//   =======  Button  =========    
//   ==========================
//										POUR GROUPER DEUX BOUTONS:		
	if (Mac_Btn === Btn_Black_2) {		//	if ( (Mac_Btn === Btn_Black_1)  ||  (Mac_Btn === Btn_Black_2) )  {
		switch(Nb_Clic){
			case 1:
				print("Black_2 x1");
				break;
			case 2:
				print("Black_2 x2");
				break;
			case 3:
				print("Black_2 x3");
				break;
			case 4:
				print("Black_2 Long");
				
		//		// Requete interne
		//		Shelly.call("HTTP.GET", {"url": "http://localhost/relay/0"}, function (res, error_code, error_msg, ud) {
		//			if (res.code === 200) {		let resobj 		= JSON.parse(res.body);
		//										let Is_On 		= resobj.ison;								
		//				// Action
		//				if (Is_On === true) {
		//					print("condition ON");
		//				}
		//				else {
		//					print("condition OFF");
		//				}
		//		}});
				
				break;
		}
	}


//   ==========================	1 (Terrasse)
//   ======  Button H&T  ==+===    
//   ==========================    
//

	if (Mac_Btn === HT_1) {
		print("Bouton H&T terrasse");		// (only x1 is possible)

		// Requete   TEMPERATURE COLLECTEE
		print("lecture de la température");				
		// console.log("temperature (", temperature,")");
		// console.log("temperature (", Event_Temperature,")");
		
	}
	

}



//////////////////////////////////////////////////////////////////////////////////////////////////
//									P A R A M E T R E S											//
//////////////////////////////////////////////////////////////////////////////////////////////////

//		# ============================== #
//		#  Dispositifs SHELLY Bluetooth  #
//		# ============================== #

let Btn_Black_T_1	=	"7c:c6:b6:71:eb:4d";	//  Garage Syl
let Btn_Black_T_2	=	"7c:c6:b6:96:5c:eb";	//  Bip Secours
let Btn_White_T_1	=	"7c:c6:b6:72:16:c5";	//  Garage Alla
let Btn_White_1		=	"5c:c7:c1:f6:40:3b";	//	Chauffe-eau
let Btn_Red_1		=	"90:ab:96:3d:60:e2";	//	radiateur chambre
//	Demo
let Btn_Black_1		=	"90:ab:96:3c:95:2f";		// Demo 
let Btn_Black_2		=	"b4:35:22:f5:15:36";		// Demo 
let Btn_White_2		=	"28:76:81:f9:69:81";		// Demo 

let Door_1			=	"b0:c7:de:06:0c:80";	//	Porte entrée
let Door_2			=	"e8:e0:7e:cb:bd:52";	//	Porte terrasse
let Door_3			=	"60:ef:ab:44:24:a3";	//	frigo
let Door_4			=	"b0:c7:de:40:4f:4b";	//	tiroir couloir
let Door_5			=	"8c:6f:b9:0b:56:33";	//	penderie couloir 
//	Demo
let Door_6			=	"b0:c7:de:3e:7c:28";		// Demo 1
let Door_7			=	"8c:6f:b9:0b:22:0c";		// Demo AA
let Door_8			=	"60:ef:ab:40:0a:13";		// Demo BB
let Door_9			=	"b0:c7:de:2c:68:59";		// Demo CC
let Motion_1		=	"3c:2e:f5:a8:c9:71";	//	Couloir
//	Demo
let Motion_2		=	"38:39:8f:70:f3:ff";		// Demo 
let HT_1			=	"7c:c6:b6:96:be:b3";	//	Sensor H&T 1 terrasse - ok
let HT_2			=	"7c:c6:b6:65:13:de";	//	Sensor H&T 2025
let HT_3			=	"7c:c6:b6:65:23:02";	//	Sensor H&T - ERIC VOISIN

//	KO
// let Door_1			=	"60:ef:ab:42:ef:f8";	//	KO - ancien Terrasse
// let Btn_White_3		=	"b0:c7:de:be:2a:8a";	//	  Demo - disparu
// let Btn_White_4		=	"7c:c6:b6:64:eb:99";	//	  Demo - disparu - ancien garage Alla

let CONFIG = {
	debug: true,
	active: true,
	Script_Number: '1',			// The script number on the Shelly device

    allowedMacAddresses: [
		Btn_Black_T_1,
		Btn_Black_T_2,
		Btn_White_T_1,
		Btn_White_1,
		Btn_Red_1,
		Btn_Black_1,	//	  Demo
		Btn_Black_2,	//	  Demo
		Btn_White_2,	//	  Demo
		Door_1,
		Door_2,
		Door_3,
		Door_4,
		Door_5,
		Door_6,			//	  Demo 1		laisser actif car signal luminosité
		Door_7,			//	  Demo AA		laisser actif car signal luminosité
		Door_8,			//	  Demo BB		laisser actif car signal luminosité
		Door_9,			//	  Demo CC		laisser actif car signal luminosité
		Motion_1,
		Motion_2,		//	  Demo
		HT_1,
		HT_2,			
		HT_3,			//	  pour Eric et Geneviève voisins
	],
	
	
	//  Concerne: MOTION //
	//  ===================
	motionHandler: function (motion, eventData) {
		// chargé seulement lorsque changement entre les états : move / no-move

		On_Motion_Detect = true;
		On_Motion = motion;		//	(Etat du mouvement)

		//		if (On_Motion === true) { 
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

	
	//  Concerne: H&T module de temperature & humidité //
	//  =================================================
	//  
	temperatureHandler: function (temperature, eventData) { 
		// --------------------------------------------- Température 
		Event_Temperature = temperature; // On affecte la valeur de température 
		console.log("temperature (", temperature,")");
		// Optionnel : Afficher la température dans la console (ou autres actions) 
		 console.log("Température gérée (", Event_Temperature, "°C)"); 
	}, 
		
	humidityHandler: function (humidity, eventData) { 
		// --------------------------------------------- Humidité 
		Event_Humidity = humidity; // On affecte la valeur d'humidité 
		console.log("taux d'humidité (", humidity,")");
		// Optionnel : Afficher l'humidité dans la console (ou autres actions) 
		 console.log("Humidité gérée (", Event_Humidity, "%)");
	},
	

	
///////////   NOUVEAU SIGNAL   //////////////////////////////////////////////////////////////////////////
	onStatusUpdate: function (eventData) {

////////////////////////////////////////////////////////////////////////////////////////////////////////

	//  pour tenter de corriger l'erreur non bloquante : BTH (key: 0, type: 0): "invalid buffer value"
	if (eventData && eventData.service_data && eventData.service_data[ALLTERCO_MFD_ID_STR]) {
		let bthData = eventData.service_data[ALLTERCO_MFD_ID_STR];
		if (bthData) {
			let pid = bthData[0]; // Lecture du PID (clé 0x00)
			if (typeof pid === 'number' && pid >= 0 && pid <= 255) { // Validation uint8
			// PID valide, utilisez la valeur
			print("PID:", pid);
			} else {
			// PID invalide, gérez l'erreur
			print("PID invalide:", pid);
			}
		}
	}


		// console.log("current MAC is: "Event_Mac);


		// Door check //
		On_Open = eventData.window;			// (état ouverture)  1 -> Ouvert  ,  0 -> Fermé
		if (On_Open !== undefined) {
			On_Open_Detect = true;
		}


//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    D O O R										//
//////////////////////////////////////////////////////////////////////////////////////////////////

		if (On_Open_Detect === true) {
			print("Type module = Door");

			//   =========================== 1  (porte entree)
			//   =========  DOOR 1  ========    
			//   ===========================    
			//	
			if (Event_Mac === Door_1) { 
				switch(On_Open){
					case 1:
						print("Door_1: Ouverture");
						break;
					case 0:
						print("Door_1: Fermeture");
						break;

				//   action locale (ex: Plug-S)
				//	
				//	case 1:
				//		print("Ouverture");
				//		print("ON");
				//		Shelly.call("Switch.Set", { id: 0, on: true });
				//		// Shelly.call("Switch.Toggle", { id: 0 });		//  (switch ON-OFF)
				//		
				//		break;
				//	case 0:
				//		print("Fermeture");
				//		print("OFF");
				//		Shelly.call("Switch.Set", { id: 0, on: false });
				//		break;						
				//		
						
				}
			}


			//   =========================== 2
			//   =========  DOOR 2  ========    
			//   ===========================    
			//	
			if (Event_Mac === Door_2) { 
				switch(On_Open){
					case 1:
						print("Door_2: Ouverture");
						break;
					case 0:
						print("Door_2: Fermeture");
						break;
				}
			}

			
			//   =========================== 
			//   =========  DOOR X  ========    
			//   ===========================    
			//	
			if (Event_Mac === Door_6) { 
				print("Door: DEMO 1");

				switch(On_Open){
					case 1:
						print("Ouverture");
						break;
					case 0:
						print("Fermeture");
						break;
				}
			}
			


		}


//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    M O T I O N									//
//////////////////////////////////////////////////////////////////////////////////////////////////

		if (On_Motion_Detect === true) { 


			//   ===========================
			//   =========  MOTION  ========    
			//   ===========================    
			//	
			if (Event_Mac === Motion_1) {
				// print("Mouvement détecté");

				switch(On_Motion){
					case true:						//	New Move (if previous event was "No more Move")
						print("New Move");
						break;

					case false:						//	No move during the last min following a move detect
						print("No more Move");
						break;
				}
			}


		}

//////////////////////////////////////////////////////////////////////////////////////////////////
//								A C T I O N  >    M A C											//
//////////////////////////////////////////////////////////////////////////////////////////////////

		//		//   TEST   //////////
		//		
		//		if (Event_Mac === "7C:C6:B6:96:BE:B3") { 
		//			print("Equipement détecté: H&T");
		//			// console.log("Température gérée (", Event_Temperature, "°C)");
		//			// console.log("Humidité gérée (", Event_Humidity, "%)");
		//		}		
        //
        //

	//		  if (Event_Mac === "7C:C6:B6:96:BE:B3") {
    //        print("Equipement détecté: H&T");
    //
    //        // Appeler les gestionnaires de température et d'humidité pour MAJ Event_Temperature et Event_Humidity
    //        if (eventData.temperature !== undefined) {
    //            CONFIG.temperatureHandler(eventData.temperature, eventData);
    //        }
    //
    //        if (eventData.humidity !== undefined) {
    //            CONFIG.humidityHandler(eventData.humidity, eventData);
    //        }
    //
    //        // Afficher les valeurs de température et d'humidité
    //        console.log("Température gérée (", Event_Temperature, "°C)");
    //        console.log("Humidité gérée (", Event_Humidity, "%)");
			
			
			
        
    





				
				
				
	}					//   Fin du bloc OnStatusUpdate  //////////////////////////////

	
	
	
};


//////////////////////////////////////////////////////////////////////////////////////////////////
//										P R O G R A M M E										//
//////////////////////////////////////////////////////////////////////////////////////////////////   ne pas modifier

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
BTH[0x2E] = { n: "occupancy", t: uint8 };
BTH[0x45] = { n: "comfort", t: uint8, m: {0:"inconfortable",1:"confortable"} };
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
	

//   liste des valeurs BTH de ce script: 
// logger("BTH Keys", Object.keys(BTH).join(", "));

// valeurs envoyées par le module Shelly
//   pour voir tout le buffer reçu
// logger("Buffer Raw Data", buffer.length);
	
	// pour ne pas utiliser JSON.stringify (plante pour Shelly)
	// remplacer	JSON.stringify(buffer)
	// par			buffer.length
	
while (buffer.length > 0) {
    let key = buffer.at(0);
    
    if (!(key in BTH)) {
        logger("unknown type", "BTH (undefined key: " + key + ") - Buffer length: " + buffer.length);
        break;
    }

    _bth = BTH[key];
    buffer = buffer.slice(1);
    
    if (!_bth || typeof _bth.t === "undefined" || typeof _bth.n === "undefined") {
        logger("invalid BTH entry", "BTH (key: " + key + ")");
        break;
    }

    _value = this.getBufValue(_bth.t, buffer);
    
    if (_value === null) {
        // logger("invalid buffer value", "BTH (key: " + key + ", type: " + _bth.t + ")");
        break;
    }

    if (typeof _bth.f !== "undefined") {
        _value *= _bth.f;
    }

    result[_bth.n] = _value;
    
    let byteSize = getByteSize(_bth.t);
    if (buffer.length < byteSize) {
        logger("buffer too short", "BTH (key: " + key + ", expected size: " + byteSize + ", remaining: " + buffer.length + ")");
        break;
    }

    buffer = buffer.slice(byteSize);
}


	
	
	
    return result;
  },
};

function onReceivedPacket (data) {
  if(CONFIG._processedMacAddresses !== null) { 
    if(CONFIG._processedMacAddresses.indexOf(data.address) < 0) {
		logger(["Not Allowed ", data.address], "Mac");
		// console.log("Not Good Mac"); 
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
  console.log("Scanner démarré");
}

init();
/*	fin du scripts	*/