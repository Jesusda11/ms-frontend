export class Lote {
    id:number
    tipo_de_carga?:string //En realidad debería ser un enum para permitir solo escoger entre determinadas categorias
    tipoDeCarga:string
    peso:number
    ruta_id:number
}
