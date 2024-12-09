const express = require('express');
const JSVM = require('../src/vm_dev');
function main() {
    const VM = new JSVM();
    VM.loadFromString('eJy1UzGL2zAY/aJLr0bGhJgaG9IGQQku9UGGbjfcUgqHhk79A06iJmkdy40d7grxdoOdMXsJ5Fd015q5fyGDlkxplyNFcu7o0EJ70OVhSe977/HwZ1AAALTVaAFAzfxBa9RpUUQBzK/OmtYV5WTIMnfbooY6IM0EdKH49aXCrketpW9ZFw0A9K0uAeDRpxmbfnbFRjptUd1k4wlLXdGWTileybIjZVPdN5BC7JRS0x73eJZFLHVW0pDaSGjEysjZS82G56KUHSGaAgDV9Fw9maUjF++rqRoq9JStQ+YKiR+UuR8EK318Qvh70mNsSnhMshEjV2EU+Ysg92Sx8IvCNrHcy4coG3fKD1N79i78yAiPGRnwq/iMJGGaknFGwimfxQNPFvm9nq6i1sal7GDcVAU52uK0qtBZHRkvcCmdEh+b+4XO/l9zDQDo/ZW88ZaTCZ8y4gf5PzkcDrffK4eUxQNX7O4csHYotIPyqX/g49jN97ahXVGg3xf6/VJ9nhHPDi79IFiYub23PYltH+PCFHInny5fW4fDbfdmiTY7tNl51LpRv7q5pa1qO06jcZqx+PcL4lFrfdwMGOm0JxEfumL+p7Av31yHkyRiJEwSUimP4yEJMzLKsuS82414P4xGPM3O/dxeexLnx6zzY9bDl/4S0HztUat/n/QnxQUGdw==', 'base64');
    VM.loadDependencies({
        124: console,
        248: express
    });
    VM.run();
    return VM.registers[121];
}
main();
