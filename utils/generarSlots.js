const generarSlots = (rangos, duracion) => {
  const slots = [];

  rangos.forEach(rango => {
    let [h, m] = rango.desde.split(':').map(Number);
    let inicio = h * 60 + m;

    let [hh, mm] = rango.hasta.split(':').map(Number);
    const fin = hh * 60 + mm;

    while (inicio + duracion <= fin) {
      const hora = String(Math.floor(inicio / 60)).padStart(2, '0');
      const min = String(inicio % 60).padStart(2, '0');

      slots.push(`${hora}:${min}`);

      inicio += duracion;
    }
  });

  return slots;
};

module.exports = generarSlots;
