import React, { useState } from "react";

export default function TabletFelvetel(){
    const[brand, setBrand]=useState<string>("");
    const[model, setModel]=useState<string>("");
    const[os, setOs]=useState<string>("");
    const[cpuModel, setCpuModel]=useState<string>("");
    const[cpuCores, setCpuCores]=useState<number>(0);
    const[cpuThreads, setCpuThreads]=useState<number>(0);
    const[ram, setRam]=useState<number>(0);
    const[storage, setStorage]=useState<number>(0);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState(null);
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const newTablet={
            brand: brand,
            model: model,
            os: os,
            cpu_model: cpuModel,
            cpu_cores: cpuCores,
            cpu_threads: cpuThreads,
            ram_size: ram,
            storage_size: storage
        }
        try{
            const response=await fetch("http://localhost:3000/tablets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    newTablet
                )
            })
            if(!response.ok){
                throw new Error(`Szervehiba: ${response.status}`);
            }
            setSuccess(false);
            setBrand("");
            setModel("");
            setOs("");
            setCpuModel("");
            setCpuCores(0);
            setCpuThreads(0);
            setRam(0);
            setStorage(0);
        }
        catch(error){
            //console.log(error);
            setError(error.message);
        }
        finally{
            //...
        }
    }

    return<>
        <header className="container my-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm p-3">
                <a className="navbar-brand" href="/">
                    <h1 className="text-primary m-0">Tabletek</h1>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link text-secondary" href="/">Kezdőlap</a>
                        </li>   
                        <li className="nav-item">
                            <a className="nav-link text-secondary" href="/tabletKartya">Tablet kiírás</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-secondary" href="/tabletTorles">Tablet törlése</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <main className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label className="font-weight-bold">Brand:</label>
                <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand"/>
                </div>
                <div className="form-group">
                <label className="font-weight-bold">Model:</label>
                <input type="text" className="form-control" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model"/>
                </div>
                <div className="form-group">
                <label className="font-weight-bold">OS:</label>
                <input type="text" className="form-control" value={os} onChange={(e) => setOs(e.target.value)} placeholder="Operating system"/>
                </div>
                <div className="form-group">
                <label className="font-weight-bold">CPU Model:</label>
                <input type="text" className="form-control" value={cpuModel} onChange={(e) => setCpuModel(e.target.value)} placeholder="CPU Model"/>
                </div>
                <div className="form-group">
                <label className="font-weight-bold">CPU Cores:</label>
                <input type="number" className="form-control" value={cpuCores} onChange={(e) => setCpuCores(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                <label className="font-weight-bold">CPU Threads:</label>
                <input type="number" className="form-control" value={cpuThreads} onChange={(e) => setCpuThreads(parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                <label className="font-weight-bold">RAM:</label>
                    <div className="input-group">
                        <input type="number" className="form-control" value={ram} onChange={(e) => setRam(parseInt(e.target.value))} />
                        <span className="input-group-text">GB</span>
                    </div>  
                </div>
                <div className="form-group">
                <label className="font-weight-bold">Storage:</label>
                    <div className="input-group">
                        <input type="number" className="form-control" value={ram} onChange={(e) => setRam(parseInt(e.target.value))} />
                        <span className="input-group-text">GB</span>
                    </div>                  
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3">Felvétel</button>
            </form>
        </main>
        {success && <p>Sikeres felvétel!</p>}
        {error && <p>Hiba történt: {error}</p>}
    </>


}

