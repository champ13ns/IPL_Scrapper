let url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results';
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let inp_url = "https://www.espncricinfo.com/";
let request = require("request");
request(url, cb);
function cb(error, response, html) {
    if (error)
        console.log(error);
    else if (response.statusCode == 404) {
        console.log("Page Not Found");
    } else {
        dataExtracter(html);
    }
}
function dataExtracter(html) {
    let sdata = cheerio.load(html);
    let slink = sdata(".row.no-gutters .btn.btn-sm.btn-outline-dark.match-cta");
    for (let i = 0; i < slink.length; i++) {
        if (sdata(slink[i]).text() == "Scorecard") {
            let str = "";
            str += (sdata(slink[i]).attr('href'));
            let n_url = inp_url + str;
            request(n_url, n_cb);
        }
    }
}
function n_cb(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log("Page Not Found");
    } else {
        let content = cheerio.load(html);
        let team_name = content(".match-info.match-info-MATCH.match-info-MATCH-half-width .teams .team .name-detail .name");
        let np1 = path.join(process.cwd(), content(team_name[0]).text());
        if (!fs.existsSync(np1))
            fs.mkdirSync(np1);
          let np2 = path.join(process.cwd(), content(team_name[1]).text());
        if (!fs.existsSync(np2))
            fs.mkdirSync(np2);
        let bat_table = content(".table.batsman tbody");
        let venue = (".font-weight-bold.match-venue");
        let venue_name = content(venue).text();
        let date=(".match-info.match-info-MATCH.match-info-MATCH-half-width .description")
        let date_str=content(date).text();
        date_str=date_str.split(",");
        date_str=date_str[2];
 let winning_str=(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span")
    let match_won=(content(winning_str).text());
    match_won=match_won.split("won");
    match_won=(match_won[0]);
        for (let i = 0; i < content(bat_table).length; i++) {
            // myTeamName name venue data oppnent TeamName result
            if (i == 1) {
                let rows = content(bat_table[0]).find("tr");
                for (let j = 0; j < rows.length - 1; j++) {
                    let f_row = content(rows[j]).find('td');
                    let name = content(f_row[0]).text().trim();
                    let run = content(f_row[2]).text().trim();
                    let ball = content(f_row[3]).text().trim();
                    let fours = content(f_row[5]).text().trim();
                    let six = content(f_row[6]).text().trim();
                    let sr = content(f_row[7]).text().trim();
                    let obj={
                        "MyTeamName":content(team_name[0]).text(),
                        "Name":name,
                        "Venue":venue_name,
                        "Date":date_str,
                        "OpponentTeamName":content(team_name[1]).text(),
                        "Result":match_won,
                        "Runs":run,
                        "Balls":ball,
                        "4s":fours,
                        "6s":six,
                        "StrikeRate":sr,
                    }
                    if(name.length > 0){
                    let f_name=name+".json"
                    let nfile_path=path.join(np1,f_name);
                    if(!fs.existsSync(nfile_path)){
                    let writeable_data=JSON.stringify(obj);
                    fs.writeFileSync(nfile_path,writeable_data);
                    }
                    else{
                       let data=JSON.stringify(obj);
                    fs.appendFileSync(nfile_path,data);
                    }
                }
                }
            } else {
                     let rows = content(bat_table[1]).find("tr");
                for (let j = 0; j < rows.length - 1; j++) {
                    let f_row = content(rows[j]).find('td');
                    let name = content(f_row[0]).text().trim();
                    let run = content(f_row[2]).text().trim();
                    let ball = content(f_row[3]).text().trim();
                    let fours = content(f_row[5]).text().trim();
                    let six = content(f_row[6]).text().trim();
                    let sr = content(f_row[7]).text().trim();
                       let obj={
                        "MyTeamName":content(team_name[1]).text(),
                        "Name":name,
                        "Venue":venue_name,
                        "Date":date_str,
                        "OpponentTeamName":content(team_name[0]).text(),
                        "Result":match_won,
                        "Runs":run,
                        "Balls":ball,
                        "Fours":fours,
                        "Six":six,
                        "StrikeRate":sr
                    }
                        if(name.length > 0){
                         let f_name=name+".json"
                    let nfile_path=path.join(np2,f_name);
                         if(!fs.existsSync(nfile_path)){
                         let writeable_data=JSON.stringify(obj);
                    fs.writeFileSync(nfile_path,writeable_data);
                         }
                         else{
                        let data=JSON.stringify(obj);
                    fs.appendFileSync(nfile_path,data);
                    }
                    // console.log(obj);
                }
                }
            }
        }
    }
}