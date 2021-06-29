import Anuncio from "./anuncio.js";

export default class Anuncio_Mascota extends Anuncio
{
    constructor(id, titulo, transaccion, descripcion, precio, tipo, raza, fecha, vacuna)
    {
        super(id, titulo, transaccion, descripcion, precio);
        this.tipo = tipo;
        this.raza = raza;
        this.fecha = fecha;
        this.vacuna = vacuna;
    }
}