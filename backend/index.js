import express from "express";
import cors from 'cors';
import mysql from 'mysql2';

const app = express();

app.use(cors())

app.use(express.json());

const db = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'tablet_store' 
}).promise();

app.get('/tablets', async (req, res) => {
    
    try {
        const temp = await db.query('SELECT * FROM tablets');
        const rows = temp[0];
        const fields = temp[1];
        res.status(200).json(rows);
    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post('/tablets', async (req, res) => {
    try {
        let tabletData = [req.body.brand, req.body.model, req.body.os, req.body.cpu_model, req.body.cpu_cores, req.body.cpu_threads, req.body.ram_size, req.body.storage_size];
        if (tabletData[0].length < 1) {
            return res.status(400).json({ error: "Tablet brand must have at least 1 character" });
        }
        if (tabletData[1].length < 1) {
            return res.status(400).json({ error: "Tablet model must have at least 1 character" });
        }
        if (tabletData[2].length < 1) {
            return res.status(400).json({ error: "Tablet os must have at least 1 character" });
        }
        if (tabletData[3].length < 1) {
            return res.status(400).json({ error: "CPU model must have at least 1 character" });
        }
        if (isNaN(tabletData[4]) || parseInt(tabletData[4]) <= 0) {
            return res.status(400).json({ error: "CPU cores must be a valid number greater than 0" });
        }
        if (isNaN(tabletData[5]) || parseInt(tabletData[5]) <= 0) {
            return res.status(400).json({ error: "CPU threads must be a valid number greater than 0" });
        }
        if (isNaN(tabletData[6]) || parseInt(tabletData[6]) <= 0) {
            return res.status(400).json({ error: "RAM size must be a valid number greater than 0" });
        }
        if (isNaN(tabletData[7]) || parseInt(tabletData[7]) <= 0) {
            return res.status(400).json({ error: "Storage size must be a valid number greater than 0" });
        }
        let tabletdata = [tabletData[0], tabletData[1], tabletData[2], tabletData[3], tabletData[4], tabletData[5], tabletData[6], tabletData[7]]
        const [rows, fields] = await db.query('INSERT INTO tablets (brand, model, os, cpu_model, cpu_cores, cpu_threads, ram_size, storage_size) VALUES (?,?,?,?,?,?,?,?)', tabletdata);
        console.log(tabletdata);
        res.status(200).json({ message: 'Tablet successfully added!'});
        
        
    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.delete('/tablets/:tablet_id', async (req, res) => {
    try {
        let tablet_id = parseInt(req.params.tablet_id);
        const [rows, fields] = await db.query('DELETE FROM tablets WHERE tablet_id =?', [tablet_id]);
        if (rows.length === 0) {
            res.status(404).json({ error: "Tablet not found" });
        } else {
            res.status(200).json({ message: "Tablet successfully removed" });
        }
 
    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})



app.listen(3000);