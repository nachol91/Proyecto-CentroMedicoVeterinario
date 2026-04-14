const url = "https://proyecto-centro-medico-veterinario.vercel.app/api/auth/login";

export const authLogin = async (datos) =>{
    try {
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await resp.json();

        return data;
        
    } catch (error) {
        console.log(error);
        return {msg: "no se pudo conectar con el backend"}
        
    }
}