require("firebase/firestore")

const retrieve = async (db, col, doc) => {
    const docRef = db.collection(col).doc(doc)
    try {
        const retrieveData = await docRef.get()
        if (retrieveData.exists) {
            return retrieveData.data()
    }
    } catch (error) {
        console.error("error :( => ", error)
        return null
    }
}

const retrieveCol = async (db, col) => {
    const docs = await getDocs(db.collection(col));
    return docs.docs.map((doc) => doc.data());
};

const ifDef = vari =>{
    if(vari == undefined){
        return ""
    } else {
        return vari
    }
}

const pull = async (db, col, doc) => {
    const dat = await retrieve(db, col, doc)
    return dat
}

const pullColl = async (db, col)=>{
    const dat = await retrieveCol(db,col)
    return dat
}

const sleep = (ms) =>{
    return new Promise((ap)=>{setTimeout(ap,ms)})
}

module.exports = {pull, ifDef,sleep, pullColl}