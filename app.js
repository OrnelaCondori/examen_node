const readline = require("readline");
const fs = require("fs");
const yargs = require("yargs");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const pedirDatos = (pregunta) => {
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            resolve(respuesta);
        });
    });
};

const main = async () => {
    console.log("Ingrese los siguientes datos: ");

    //pido los datos
    const producto = await pedirDatos("Producto: ");
    const precio = await pedirDatos("Precio: ");
    const cantidad = await pedirDatos("Cantidad: ");

    rl.close();
    // console.log("---------------------------\nDatos ingresados:");
    // console.log(`Producto: ${producto}`);
    // console.log(`Cantidad: ${cantidad}`);
    // console.log(`Precio: ${precio}`);

    const nuevoProducto = {
        nombre: producto,
        precio: precio,
        cantidad: cantidad,
    };

    //pido el archivo json
    const argv = yargs.argv;
    const file = argv.file || argv.f || "productos.json";

    fs.readFile(file, "utf8", (err, data) => {
        let productos = [];

        if (err || !data.trim()) {
            console.log("el archivo no existe o está vacío- creando uno nuevo");
        } else {
            try {
                productos = JSON.parse(data);
            } catch (e) {
                console.error("Error al leer el archivo JSON:", e);
                return;
            }
        }
        //se agrega el producto al array
        productos.push(nuevoProducto);

        fs.writeFile(file, JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                console.error("error al guardar los cambios", err);
            } else {
                console.log("se guardaron los productos");

                // Lee el archivo JSON después de guardar los datos
                fs.readFile(file, "utf8", (err, data) => {
                    if (err) {
                        console.error("Error al leer el archivo:", err);
                    } else {
                        console.log("Contenido del archivo:");
                        try {
                            const productosGuardados = JSON.parse(data);
                            console.table(productosGuardados);
                        } catch (e) {
                            console.error("Error al leer el archivo ", e);
                        }
                    }
                });
            }
        });
    });
};

main();
