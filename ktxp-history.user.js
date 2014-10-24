// ==UserScript==
// @name        ktxp-archive
// @author     	mmm
// @description 不会再忘记看到哪一集了
// @namespace   http://bakaboku.info
// @license     GPL version 3
// @encoding    utf-8
// @include     http://bt.ktxp.com/*
// @version     1.0
// ==/UserScript==

function openDB(name) {
	var request = window.indexedDB.open(name, myDB.version);
	request.onerror = function(e) {
		console.log('Open error!');
	};
	request.onsuccess = function(e) {
		myDB.db = e.target.result;
		console.log('Open success!');
		var cons = document.querySelectorAll('tbody tr td a[target=_blank]');
		for (var i in cons) {
			var con = cons[i];
			exist(myDB.db, myDB.storeName, con);
			con.onclick = function() {
				addData(myDB.db, myDB.storeName, {
					url: this.href
				});
			};
		}
	};
	request.onupgradeneeded = function(e) {
		var db = e.target.result;
		if (!db.objectStoreNames.contains(myDB.storeName)) {
			db.createObjectStore(myDB.storeName, {
				keyPath: "url"
			});
		}
		console.log('DB version changed to ' + myDB.version);
	}
}

function addData(db, storeName, url) {
	var transaction = db.transaction(storeName, 'readwrite');
	var store = transaction.objectStore(storeName);
	store.add(url);
}

function exist(db, storeName, docum) {
	var transaction = db.transaction(storeName, 'readwrite');
	var store = transaction.objectStore(storeName);
	var doc = docum;
	try {
		var request = store.get(doc.href);
		request.onsuccess = function(e) {
			var url = e.target.result;
			if (url != undefined)
				if (url.url == doc.href) {
					doc.style.color = 'red'
				}
		};
	} catch (e) {}
}

var myDB = {
	name: 'ktxp',
	storeName: 'urls',
	version: 2,
	db: null
};

openDB(myDB.name);
