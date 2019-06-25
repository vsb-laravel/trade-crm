function asyncSelect(connection,sourceName){
    return new Promise( (resolve, reject) => {
        connection.query(`select * from sources where name='${sourceName}' `,(error,result,fields) =>{
            if(error) reject(error);
            let sources = JSON.parse(JSON.stringify(result));
            if(sources.length) resolve(sources[0]);
            else reject(result);
        });
    });
}
async function getSource(connection,sourceName){
    return await asyncSelect(connection,sourceName);
}
module.exports = [getSource,asyncSelect];
