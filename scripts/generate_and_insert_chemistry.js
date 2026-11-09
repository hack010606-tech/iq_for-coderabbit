const crypto = require('crypto');
const { createClient } = require('../backend/node_modules/@supabase/supabase-js');
require('../backend/node_modules/dotenv').config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ==========================================
// 100 CHEMISTRY MCQS (Single Correct)
// ==========================================
const chemistryMcqs = [
  // --- ATOMIC STRUCTURE (1-8) ---
  {
    topic: "Atomic Structure",
    difficulty: "easy",
    question_text: "The maximum number of electrons that can be accommodated in a subshell with azimuthal quantum number $l = 3$ is:",
    options: ["14", "10", "6", "2"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "The wavelength associated with an electron moving with a velocity of $10^6\\text{ m/s}$ (mass of electron $= 9.1 \\times 10^{-31}\\text{ kg}, h = 6.63 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$) is approximately:",
    options: ["$7.28\\text{ \\AA}$", "$0.728\\text{ \\AA}$", "$72.8\\text{ \\AA}$", "$728\\text{ \\AA}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "The radius of the second Bohr orbit of $\\text{Li}^{2+}$ ion is ($r_1$ is radius of first Bohr orbit of H-atom):",
    options: ["$\\frac{4}{3}r_1$", "$\\frac{9}{4}r_1$", "$\\frac{3}{4}r_1$", "$4r_1$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "hard",
    question_text: "The number of radial nodes and angular nodes for a $4d$ orbital are respectively:",
    options: ["1 and 2", "2 and 1", "2 and 2", "0 and 2"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "easy",
    question_text: "Which of the following electronic configurations represents an element in an excited state?",
    options: ["[Ne] $3s^1 3p^1$", "[Ne] $3s^2 3p^4$", "[Ar] $3d^5 4s^1$", "[He] $2s^2 2p^3$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "According to Heisenberg's uncertainty principle, $\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi}$. If the uncertainty in position of an electron is zero, the uncertainty in its momentum is:",
    options: ["Infinite", "Zero", "$\\frac{h}{4\\pi}$", "$h$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "The energy of an electron in the $n^{\\text{th}}$ Bohr orbit of hydrogen atom is given by $E_n = -\\frac{13.6}{n^2}\\text{ eV}$. The ionization energy of $\\text{He}^{+}$ ion from its ground state is:",
    options: ["$54.4\\text{ eV}$", "$13.6\\text{ eV}$", "$27.2\\text{ eV}$", "$122.4\\text{ eV}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "hard",
    question_text: "The ratio of the difference in energy between the first and second Bohr orbit to that between the second and third Bohr orbit of hydrogen atom is:",
    options: ["$\\frac{27}{5}$", "$\\frac{5}{27}$", "$\\frac{9}{4}$", "$\\frac{4}{9}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- CHEMICAL BONDING (9-18) ---
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "The hybridization and geometry of the $\\text{XeF}_4$ molecule according to VSEPR theory are:",
    options: ["$sp^3d^2$, Square planar", "$sp^3d$, See-saw", "$sp^3d^2$, Octahedral", "$sp^3$, Tetrahedral"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "easy",
    question_text: "Which of the following molecules has zero dipole moment?",
    options: ["$\\text{BF}_3$", "$\\text{NH}_3$", "$\\text{H}_2\\text{O}$", "$\\text{SO}_2$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "According to Molecular Orbital Theory, the bond order of $\\text{O}_2^{+}$ species is:",
    options: ["$2.5$", "$2.0$", "$1.5$", "$3.0$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "hard",
    question_text: "Among the following, which species is diamagnetic?",
    options: ["$\\text{N}_2$", "$\\text{O}_2$", "$\\text{B}_2$", "$\\text{NO}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "The correct order of bond angles in $\\text{CH}_4, \\text{NH}_3,$ and $\\text{H}_2\\text{O}$ is:",
    options: [
      "$\\text{CH}_4 > \\text{NH}_3 > \\text{H}_2\\text{O}$",
      "$\\text{H}_2\\text{O} > \\text{NH}_3 > \\text{CH}_4$",
      "$\\text{NH}_3 > \\text{CH}_4 > \\text{H}_2\\text{O}$",
      "$\\text{CH}_4 = \\text{NH}_3 = \\text{H}_2\\text{O}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "easy",
    question_text: "The type of intermolecular forces responsible for the high boiling point of water compared to $\\text{H}_2\\text{S}$ is:",
    options: ["Hydrogen bonding", "London dispersion forces", "Dipole-induced dipole forces", "Ionic bonding"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "In $\\text{PCl}_5$ molecule in the gas phase, the axial bonds are longer than equatorial bonds because:",
    options: [
      "Axial pairs suffer greater repulsion from equatorial pairs",
      "Equatorial pairs suffer greater repulsion",
      "Axial bonds have more $s$-character",
      "Chlorine atoms on axial positions are larger"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "hard",
    question_text: "Which of the following pairs is isostructural (have the same shape)?",
    options: [
      "$\\text{CO}_3^{2-}$ and $\\text{NO}_3^{-}$",
      "$\\text{NH}_3$ and $\\text{BF}_3$",
      "$\\text{SF}_4$ and $\\text{CH}_4$",
      "$\\text{ICl}_4^{-}$ and $\\text{SiCl}_4$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "The number of $\\sigma$ and $\\pi$ bonds in a molecule of ethyne (acetylene, $\\text{C}_2\\text{H}_2$) are respectively:",
    options: ["3 and 2", "2 and 3", "3 and 1", "4 and 2"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "The state of hybridization of carbon in diamond, graphite, and fullerene respectively are:",
    options: ["$sp^3, sp^2, sp^2$", "$sp^2, sp^3, sp^2$", "$sp^3, sp^3, sp^2$", "$sp^3, sp^2, sp$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- THERMODYNAMICS & THERMOCHEMISTRY (19-26) ---
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "For a spontaneous process at constant temperature and pressure, the criterion for spontaneity is:",
    options: ["$\\Delta G < 0$", "$\\Delta H < 0$", "$\\Delta S_{\\text{system}} > 0$", "$\\Delta U < 0$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "easy",
    question_text: "An adiabatic process is one in which:",
    options: ["No heat enters or leaves the system ($q = 0$)", "Temperature remains constant", "Pressure remains constant", "Volume remains constant"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "For the reaction $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g)$, the relation between $\\Delta H$ and $\\Delta U$ at temperature $T$ is:",
    options: ["$\\Delta H = \\Delta U - 2RT$", "$\\Delta H = \\Delta U + 2RT$", "$\\Delta H = \\Delta U - RT$", "$\\Delta H = \\Delta U$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "hard",
    question_text: "The standard enthalpy of formation ($\\Delta_f H^\\circ$) is zero at $298\\text{ K}$ for:",
    options: ["$\\text{C}_{\\text{graphite}}$", "$\\text{C}_{\\text{diamond}}$", "$\\text{O}_3(g)$", "$\\text{H}_2\\text{O}(l)$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "One mole of an ideal gas expands isothermally and reversibly from $10\\text{ L}$ to $100\\text{ L}$ at $300\\text{ K}$. The work done is (take $R = 8.314\\text{ J/mol}\\cdot\\text{K}$):",
    options: ["$-5744\\text{ J}$", "$-2494\\text{ J}$", "$5744\\text{ J}$", "$0\\text{ J}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "According to the Third Law of Thermodynamics, the entropy of a perfectly crystalline solid is zero at:",
    options: ["Absolute zero ($0\\text{ K}$)", "$0^\\circ\\text{C}$", "$273\\text{ K}$", "$298\\text{ K}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "hard",
    question_text: "For the process $\\text{H}_2\\text{O}(l) \\rightleftharpoons \\text{H}_2\\text{O}(g)$ at $100^\\circ\\text{C}$ and $1\\text{ atm}$ pressure, the value of $\\Delta G$ is:",
    options: ["Zero", "Positive", "Negative", "Undefined"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "easy",
    question_text: "Which of the following is an intensive property?",
    options: ["Density", "Mass", "Volume", "Enthalpy"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- CHEMICAL EQUILIBRIUM & IONIC EQUILIBRIUM (27-36) ---
  {
    topic: "Chemical Equilibrium",
    difficulty: "medium",
    question_text: "For the equilibrium $\\text{PCl}_5(g) \\rightleftharpoons \\text{PCl}_3(g) + \\text{Cl}_2(g)$, increasing the pressure on the system at constant temperature will:",
    options: [
      "Shift the equilibrium in the backward direction",
      "Shift the equilibrium in the forward direction",
      "Increase the value of $K_p$",
      "Have no effect on equilibrium composition"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Equilibrium",
    difficulty: "easy",
    question_text: "The equilibrium constant expression $K_c$ for the reaction $\\text{CaCO}_3(s) \\rightleftharpoons \\text{CaO}(s) + \\text{CO}_2(g)$ is:",
    options: ["$K_c = [\\text{CO}_2]$", "$K_c = \\frac{[\\text{CaO}][\\text{CO}_2]}{[\\text{CaCO}_3]}$", "$K_c = [\\text{CaO}][\\text{CO}_2]$", "$K_c = \\frac{[\\text{CO}_2]}{[\\text{CaCO}_3]}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Equilibrium",
    difficulty: "medium",
    question_text: "The relation between equilibrium constant $K_p$ and $K_c$ for a gaseous reaction is $K_p = K_c (RT)^{\\Delta n_g}$. If $\\Delta n_g = 0$, then:",
    options: ["$K_p = K_c$", "$K_p > K_c$", "$K_p < K_c$", "$K_p = 1/K_c$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "medium",
    question_text: "The pH of a $10^{-8}\\text{ M}$ aqueous solution of $\\text{HCl}$ at $25^\\circ\\text{C}$ is:",
    options: [
      "Between 6 and 7 (approx 6.98)",
      "Exactly 8",
      "Exactly 6",
      "Between 7 and 8"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "easy",
    question_text: "The conjugate base of $\\text{HSO}_4^{-}$ is:",
    options: ["$\\text{SO}_4^{2-}$", "$\\text{H}_2\\text{SO}_4$", "$\\text{H}_3\\text{SO}_4^{+}$", "$\\text{SO}_3^{2-}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "hard",
    question_text: "The solubility product of a sparingly soluble salt $\\text{Ag}_2\\text{CrO}_4$ with solubility $s\\text{ mol/L}$ is:",
    options: ["$4s^3$", "$s^2$", "$27s^4$", "$108s^5$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "medium",
    question_text: "An acidic buffer solution can be prepared by mixing equimolar amounts of:",
    options: [
      "$\\text{CH}_3\\text{COOH}$ and $\\text{CH}_3\\text{COONa}$",
      "$\\text{HCl}$ and $\\text{NaCl}$",
      "$\\text{NH}_4\\text{OH}$ and $\\text{NH}_4\\text{Cl}$",
      "$\\text{NaOH}$ and $\\text{CH}_3\\text{COONa}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "medium",
    question_text: "The degree of dissociation of a weak monobasic acid (Ostwald's dilution law) at concentration $C$ and dissociation constant $K_a$ (when $\\alpha \\ll 1$) is:",
    options: ["$\\alpha = \\sqrt{\\frac{K_a}{C}}$", "$\\alpha = \\frac{K_a}{C}$", "$\\alpha = \\sqrt{K_a C}$", "$\\alpha = K_a C$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "hard",
    question_text: "The pH of a salt of weak acid and weak base (having dissociation constants $K_a$ and $K_b$) is given by:",
    options: [
      "$\\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)$",
      "$\\text{pH} = 7 - \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)$",
      "$\\text{pH} = 7 + \\frac{1}{2}(\\text{p}K_a + \\text{p}K_b)$",
      "$\\text{pH} = \\frac{1}{2}(\\text{p}K_a - \\text{p}K_b)$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Equilibrium",
    difficulty: "easy",
    question_text: "A catalyst added to a reversible reaction in equilibrium:",
    options: [
      "Increases the rate of forward and backward reactions equally without changing equilibrium constant",
      "Increases the yield of products",
      "Increases the equilibrium constant",
      "Decreases the rate of the reverse reaction"
    ],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- ELECTROCHEMISTRY (37-44) ---
  {
    topic: "Electrochemistry",
    difficulty: "medium",
    question_text: "The Nernst equation for a cell reaction at $298\\text{ K}$ with reaction quotient $Q$ and $n$ electrons transferred is:",
    options: [
      "$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\log Q$",
      "$E_{\\text{cell}} = E^\\circ_{\\text{cell}} + \\frac{0.0591}{n}\\log Q$",
      "$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\ln Q$",
      "$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{n}{0.0591}\\log Q$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "easy",
    question_text: "According to Faraday's First Law of Electrolysis, the mass $m$ of substance deposited at an electrode is proportional to:",
    options: ["Quantity of electricity $Q = I \\cdot t$", "Potential difference $V$", "Resistance $R$", "Temperature $T$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "medium",
    question_text: "Kohlrausch's law of independent migration of ions is used to calculate the limiting molar conductivity ($\\Lambda_m^\\circ$) of:",
    options: [
      "Weak electrolytes at infinite dilution",
      "Strong electrolytes only at high concentrations",
      "Insoluble solids",
      "Gases"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "hard",
    question_text: "The standard reduction potentials of $\\text{Zn}^{2+}/\\text{Zn}$ and $\\text{Cu}^{2+}/\\text{Cu}$ are $-0.76\\text{ V}$ and $+0.34\\text{ V}$ respectively. The standard emf of the Daniell cell is:",
    options: ["$+1.10\\text{ V}$", "$-0.42\\text{ V}$", "$+0.42\\text{ V}$", "$-1.10\\text{ V}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "medium",
    question_text: "The relationship between standard Gibbs free energy change $\\Delta G^\\circ$ and standard cell potential $E^\\circ$ is:",
    options: ["$\\Delta G^\\circ = -nFE^\\circ$", "$\\Delta G^\\circ = nFE^\\circ$", "$\\Delta G^\\circ = -\\frac{E^\\circ}{nF}$", "$\\Delta G^\\circ = -RT \\ln E^\\circ$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "easy",
    question_text: "In a lead storage battery during discharging, which of the following reactions takes place at the anode?",
    options: [
      "$\\text{Pb}(s) + \\text{SO}_4^{2-}(aq) \\to \\text{PbSO}_4(s) + 2e^{-}$",
      "$\\text{PbO}_2(s) + 4\\text{H}^{+} + \\text{SO}_4^{2-} + 2e^{-} \\to \\text{PbSO}_4 + 2\\text{H}_2\\text{O}$",
      "$\\text{Pb}^{2+} + 2e^{-} \\to \\text{Pb}$",
      "$2\\text{H}_2\\text{O} \\to \\text{O}_2 + 4\\text{H}^{+} + 4e^{-}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "hard",
    question_text: "The quantity of charge required to obtain $1\\text{ mole}$ of aluminium from molten $\\text{Al}_2\\text{O}_3$ is:",
    options: ["$3F$", "$1F$", "$6F$", "$2F$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "medium",
    question_text: "The unit of molar conductivity $\\Lambda_m$ is:",
    options: ["$\\text{S}\\cdot\\text{cm}^2\\cdot\\text{mol}^{-1}$", "$\\text{S}\\cdot\\text{cm}^{-1}$", "$\\text{S}\\cdot\\text{cm}\\cdot\\text{mol}^{-1}$", "$\\Omega\\cdot\\text{cm}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- CHEMICAL KINETICS (45-52) ---
  {
    topic: "Chemical Kinetics",
    difficulty: "easy",
    question_text: "The unit of rate constant for a first-order chemical reaction is:",
    options: ["$\\text{s}^{-1}$", "$\\text{mol}\\cdot\\text{L}^{-1}\\cdot\\text{s}^{-1}$", "$\\text{L}\\cdot\\text{mol}^{-1}\\cdot\\text{s}^{-1}$", "$\\text{L}^2\\cdot\\text{mol}^{-2}\\cdot\\text{s}^{-1}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "The half-life ($t_{1/2}$) of a first-order reaction with rate constant $k$ is given by:",
    options: ["$\\frac{0.693}{k}$", "$\\frac{[A]_0}{2k}$", "$\\frac{1}{k[A]_0}$", "$\\frac{k}{0.693}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "According to the Arrhenius equation $k = A e^{-E_a/RT}$, a plot of $\\ln k$ versus $1/T$ gives a straight line with slope equal to:",
    options: ["$-\\frac{E_a}{R}$", "$\\frac{E_a}{R}$", "$-\\frac{E_a}{2.303}$", "$\\ln A$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "hard",
    question_text: "For a reaction $2A + B \\to \\text{Products}$, doubling the concentration of $A$ quadruples the rate, while doubling $B$ doubles the rate. The overall order of the reaction is:",
    options: ["3", "2", "1", "4"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "A zero-order reaction is $100\\%$ complete in time $t = $:",
    options: ["$\\frac{[A]_0}{k}$", "$\\frac{[A]_0}{2k}$", "$\\frac{2k}{[A]_0}$", "Infinite time"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "easy",
    question_text: "The temperature coefficient of a reaction is usually between:",
    options: ["2 and 3", "1 and 1.5", "4 and 5", "0.5 and 1"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "hard",
    question_text: "In the presence of a catalyst, the activation energy of a reaction decreases by $20\\text{ kJ/mol}$. The catalyst increases the rate of reaction at $300\\text{ K}$ by a factor of approximately ($e^8 \\approx 3000$):",
    options: ["About $3000$ times", "About $20$ times", "About $2$ times", "About $50$ times"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "Radioactive decay follows kinetics of which order?",
    options: ["First order", "Zero order", "Second order", "Pseudo-first order"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- SOLUTIONS & COLLIGATIVE PROPERTIES (53-60) ---
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "medium",
    question_text: "Which of the following $0.1\\text{ M}$ aqueous solutions will exhibit the highest boiling point elevation?",
    options: ["$\\text{Al}_2(\\text{SO}_4)_3$", "$\\text{NaCl}$", "$\\text{BaCl}_2$", "Glucose"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "easy",
    question_text: "The van 't Hoff factor $i$ for a completely dissociated strong electrolyte $\\text{K}_4[\\text{Fe}(\\text{CN})_6]$ in water is:",
    options: ["5", "4", "3", "6"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "medium",
    question_text: "According to Raoult's law for an ideal solution of two volatile liquids A and B, the total vapor pressure is given by:",
    options: ["$P_{\\text{total}} = p_A^\\circ x_A + p_B^\\circ x_B$", "$P_{\\text{total}} = p_A^\\circ + p_B^\\circ$", "$P_{\\text{total}} = \\frac{p_A^\\circ}{x_A} + \\frac{p_B^\\circ}{x_B}$", "$P_{\\text{total}} = (p_A^\\circ + p_B^\\circ)(x_A + x_B)$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "hard",
    question_text: "A mixture of ethanol and acetone shows positive deviation from Raoult's law because:",
    options: [
      "A-B interactions are weaker than A-A and B-B interactions",
      "A-B interactions are stronger than A-A and B-B interactions",
      "Ethanol and acetone form a complex",
      "Volume of mixing is negative"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "medium",
    question_text: "The osmotic pressure $\\Pi$ of a solution containing $n$ moles of solute in volume $V$ at temperature $T$ is given by:",
    options: ["$\\Pi = CRT$", "$\\Pi = \\frac{RT}{C}$", "$\\Pi = \\frac{C}{RT}$", "$\\Pi = C^2 RT$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "easy",
    question_text: "Two solutions having the same osmotic pressure at a given temperature are termed as:",
    options: ["Isotonic solutions", "Hypertonic solutions", "Hypotonic solutions", "Azeotropic mixtures"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "hard",
    question_text: "When benzoic acid dissolves in benzene, it undergoes dimerization. The van 't Hoff factor $i$ in terms of degree of association $\\alpha$ is:",
    options: ["$1 - \\frac{\\alpha}{2}$", "$1 + \\alpha$", "$1 - \\alpha$", "$1 + 2\\alpha$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "medium",
    question_text: "The depression in freezing point constant ($K_f$) depends upon:",
    options: ["Nature of the solvent only", "Nature of the solute only", "Molarity of solution", "Atmospheric pressure"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- SOLID STATE & GASEOUS STATE (61-68) ---
  {
    topic: "Solid State",
    difficulty: "medium",
    question_text: "The total number of atoms per unit cell in a face-centered cubic (FCC) lattice is:",
    options: ["4", "2", "1", "6"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Solid State",
    difficulty: "easy",
    question_text: "The coordination number of a constituent particle in a body-centered cubic (BCC) crystal lattice is:",
    options: ["8", "6", "12", "4"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Solid State",
    difficulty: "medium",
    question_text: "The packing efficiency of a simple cubic (SC), body-centered cubic (BCC), and face-centered cubic (FCC) lattice respectively are:",
    options: ["$52.4\\%, 68\\%, 74\\%$", "$68\\%, 52.4\\%, 74\\%$", "$74\\%, 68\\%, 52.4\\%$", "$52.4\\%, 74\\%, 68\\%$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Solid State",
    difficulty: "hard",
    question_text: "Schottky defect in a crystal lattice arises due to:",
    options: [
      "Missing of equal numbers of cations and anions from lattice sites",
      "Dislocation of an ion from lattice site to an interstitial site",
      "Presence of extra cations in interstitial sites",
      "Metal deficiency"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Gaseous State",
    difficulty: "medium",
    question_text: "In van der Waals equation $\\left(P + \\frac{an^2}{V^2}\\right)(V - nb) = nRT$, the constant '$a$' accounts for:",
    options: ["Intermolecular attractive forces", "Finite volume of molecules", "Kinetic energy of molecules", "Molecular collision frequency"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Gaseous State",
    difficulty: "hard",
    question_text: "The compressibility factor $Z = \\frac{PV}{nRT}$ for an ideal gas is:",
    options: ["1", "0", "Greater than 1", "Less than 1"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Gaseous State",
    difficulty: "medium",
    question_text: "According to Graham's Law of Diffusion, the rate of diffusion $r$ of a gas is inversely proportional to:",
    options: ["Square root of its molar mass ($\\sqrt{M}$)", "Its molar mass ($M$)", "Square of its molar mass ($M^2$)", "Its volume ($V$)"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Solid State",
    difficulty: "easy",
    question_text: "An example of a covalent network solid is:",
    options: ["Diamond (Carbon)", "Dry ice (solid $\\text{CO}_2$)", "$\\text{NaCl}$", "Ice"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- COORDINATION COMPOUNDS (69-76) ---
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "The IUPAC name of the complex $[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2$ is:",
    options: [
      "Pentaamminechloridocobalt(III) chloride",
      "Pentaamminechlorocobalt(II) chloride",
      "Chloropentaamminecobalt(III) chloride",
      "Cobalt(III) pentaamminechloride"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "easy",
    question_text: "The coordination number of $\\text{Fe}$ in potassium ferrocyanide $\\text{K}_4[\\text{Fe}(\\text{CN})_6]$ is:",
    options: ["6", "4", "2", "8"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "hard",
    question_text: "According to Crystal Field Theory, for an octahedral $d^4$ complex in a strong field ligand environment (where $\\Delta_o > P$), the electronic configuration is:",
    options: ["$t_{2g}^4 e_g^0$", "$t_{2g}^3 e_g^1$", "$t_{2g}^2 e_g^2$", "$t_{2g}^1 e_g^3$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "The spin-only magnetic moment $\\mu_s$ of an octahedral complex $[\\text{Fe}(\\text{H}_2\\text{O})_6]^{2+}$ (high spin, 4 unpaired electrons) is:",
    options: ["$4.90\\text{ BM}$", "$5.92\\text{ BM}$", "$3.87\\text{ BM}$", "$2.83\\text{ BM}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "Which of the following ligands is an ambidentate ligand?",
    options: ["$\\text{NO}_2^{-}$", "$\\text{NH}_3$", "$\\text{H}_2\\text{O}$", "$\\text{en}$ (ethylenediamine)"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "hard",
    question_text: "The complex $[\\text{Pt}(\\text{NH}_3)_2\\text{Cl}_2]$ exhibits which type of isomerism?",
    options: ["Geometrical isomerism (cis-trans)", "Optical isomerism", "Linkage isomerism", "Coordination isomerism"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "easy",
    question_text: "EDTA ($[\\text{EDTA}]^{4-}$) is an example of a:",
    options: ["Hexadentate chelating ligand", "Bidentate ligand", "Monodentate ligand", "Tridentate ligand"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "Which of the following complexes is diamagnetic?",
    options: ["$[\\text{Ni}(\\text{CO})_4]$", "$[\\text{NiCl}_4]^{2-}$", "$[\\text{FeF}_6]^{3-}$", "$[\\text{Mn}(\\text{H}_2\\text{O})_6]^{2+}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- INORGANIC & PERIODIC PROPERTIES / D & P BLOCK (77-84) ---
  {
    topic: "d-Block Elements",
    difficulty: "medium",
    question_text: "Transition elements exhibit variable oxidation states primarily because of:",
    options: [
      "Comparable energies of $(n-1)d$ and $ns$ orbitals",
      "Large size of atoms",
      "High ionization enthalpy",
      "Vacant $p$-orbitals"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "d-Block Elements",
    difficulty: "easy",
    question_text: "Which of the following transition metal ions is colorless in aqueous solution?",
    options: ["$\\text{Sc}^{3+}$ ($d^0$)", "$\\text{Cu}^{2+}$ ($d^9$)", "$\\text{Fe}^{3+}$ ($d^5$)", "$\\text{Ni}^{2+}$ ($d^8$)$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "d-Block Elements",
    difficulty: "medium",
    question_text: "Potassium permanganate ($\\text{KMnO}_4$) in acidic medium acts as a strong oxidizing agent and reduces to:",
    options: ["$\\text{Mn}^{2+}$", "$\\text{MnO}_2$", "$\\text{MnO}_4^{2-}$", "$\\text{Mn}^{3+}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "p-Block Elements-I",
    difficulty: "medium",
    question_text: "The anomalous behavior of nitrogen in group 15 elements is attributed to:",
    options: [
      "Small size, high electronegativity, and absence of vacant $d$-orbitals",
      "Large size and presence of $d$-orbitals",
      "Metallic character",
      "Low ionization enthalpy"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "p-Block Elements-I",
    difficulty: "hard",
    question_text: "The basicity of orthophosphoric acid ($\\text{H}_3\\text{PO}_4$) and phosphorous acid ($\\text{H}_3\\text{PO}_3$) respectively are:",
    options: ["3 and 2", "3 and 3", "2 and 3", "1 and 2"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "p-Block Elements-I",
    difficulty: "easy",
    question_text: "Among the halogens, the correct order of electron gain enthalpy (with negative sign) is:",
    options: ["$\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}$", "$\\text{F} > \\text{Cl} > \\text{Br} > \\text{I}$", "$\\text{Cl} > \\text{Br} > \\text{F} > \\text{I}$", "$\\text{F} > \\text{Br} > \\text{Cl} > \\text{I}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "d-Block Elements",
    difficulty: "hard",
    question_text: "Lanthanoid contraction is responsible for which of the following facts?",
    options: [
      "$\\text{Zr}$ and $\\text{Hf}$ have almost identical atomic and ionic radii",
      "$\\text{La}$ and $\\text{Lu}$ have the same oxidation states",
      "$\\text{Zr}$ and $\\text{Y}$ have the same radius",
      "Lanthanoids are good conductors"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "p-Block Elements-I",
    difficulty: "medium",
    question_text: "The geometry of $\\text{XeOF}_4$ molecule is:",
    options: ["Square pyramidal", "Square planar", "See-saw", "Trigonal bipyramidal"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- ORGANIC CHEMISTRY: HYDROCARBONS & BASIC CONCEPTS (85-92) ---
  {
    topic: "Organic Halides and Organic Concepts",
    difficulty: "medium",
    question_text: "In an $S_N1$ nucleophilic substitution reaction of an optically active alkyl halide, the product obtained exhibits:",
    options: ["Racemization with slight net inversion", "Complete retention of configuration", "Complete inversion of configuration", "No optical activity change"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Organic Halides and Organic Concepts",
    difficulty: "easy",
    question_text: "The intermediate species formed during an $S_N2$ reaction mechanism is:",
    options: ["A pentacoordinate transition state", "A planar carbocation", "A carbanion", "A free radical"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "IOC and Hydrocarbons",
    difficulty: "medium",
    question_text: "According to Huckel's rule, a planar monocyclic completely conjugated ring compound is aromatic if it contains:",
    options: ["$(4n + 2)\\pi$ electrons ($n = 0, 1, 2, \\dots$)", "$4n\\pi$ electrons", "$(2n + 1)\\pi$ electrons", "$(4n - 2)\\pi$ electrons"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "IOC and Hydrocarbons",
    difficulty: "medium",
    question_text: "Addition of $\\text{HBr}$ to propene in the presence of benzoyl peroxide yields 1-bromopropane via:",
    options: ["Free radical addition (Kharasch effect)", "Electrophilic addition", "Nucleophilic addition", "Carbocation rearrangement"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "IOC and Hydrocarbons",
    difficulty: "hard",
    question_text: "Ozonolysis of 2,3-dimethylbut-2-ene followed by reductive cleavage with $\\text{Zn}/\\text{H}_2\\text{O}$ gives exclusively:",
    options: ["Acetone (propan-2-one)", "Acetaldehyde", "Formaldehyde", "Acetic acid"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Organic Halides and Organic Concepts",
    difficulty: "medium",
    question_text: "The correct order of stability of carbocations is:",
    options: [
      "$\\text{Tertiary} > \\text{Secondary} > \\text{Primary} > \\text{Methyl}$",
      "$\\text{Methyl} > \\text{Primary} > \\text{Secondary} > \\text{Tertiary}$",
      "$\\text{Primary} > \\text{Secondary} > \\text{Tertiary} > \\text{Methyl}$",
      "$\\text{Secondary} > \\text{Tertiary} > \\text{Primary} > \\text{Methyl}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "IOC and Hydrocarbons",
    difficulty: "easy",
    question_text: "In Friedel-Crafts alkylation of benzene, the electrophile generated using $\\text{CH}_3\\text{Cl}$ and anhydrous $\\text{AlCl}_3$ is:",
    options: ["$\\text{CH}_3^{+}$ (methyl cation)", "$\\text{CH}_3^{-}$", "$\\text{CH}_3^\\bullet$ free radical", "$\\text{AlCl}_4^{-}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Organic Halides and Organic Concepts",
    difficulty: "hard",
    question_text: "Which of the following compounds will react fastest towards $S_N2$ displacement with $\\text{I}^{-}$ ion?",
    options: ["$\\text{CH}_3\\text{Cl}$", "$\\text{CH}_3\\text{CH}_2\\text{Cl}$", "$(\\text{CH}_3)_2\\text{CHCl}$", "$(\\text{CH}_3)_3\\text{CCl}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- ORGANIC CHEMISTRY: FUNCTIONAL GROUPS (93-100) ---
  {
    topic: "Oxygen Containing Organic Compound-I",
    difficulty: "medium",
    question_text: "When phenol is treated with chloroform and aqueous $\\text{NaOH}$ followed by acid hydrolysis (Reimer-Tiemann reaction), the major product is:",
    options: ["Salicylaldehyde (2-hydroxybenzaldehyde)", "Salicylic acid", "Benzoic acid", "Chlorobenzene"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Oxygen Containing Organic Compound-II",
    difficulty: "medium",
    question_text: "Aldehydes having no $\\alpha$-hydrogen atom undergo self oxidation-reduction on heating with concentrated alkali in:",
    options: ["Cannizzaro reaction", "Aldol condensation", "Perkin reaction", "Clemmensen reduction"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Oxygen Containing Organic Compound-II",
    difficulty: "easy",
    question_text: "Tollens' reagent is chemically:",
    options: ["Ammoniacal silver nitrate solution", "Alkaline copper sulfate with sodium potassium tartrate", "Acidic potassium dichromate", "Neutral ferric chloride"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Oxygen Containing Organic Compound-II",
    difficulty: "hard",
    question_text: "Which of the following compounds gives a positive iodoform test upon reaction with $\\text{I}_2/\\text{NaOH}$?",
    options: ["Propan-2-one (acetone)", "Propan-1-ol", "Benzophenone", "Methanal (formaldehyde)"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Nitrogen Containing Organic Compounds",
    difficulty: "medium",
    question_text: "The conversion of a primary amide to a primary amine having one carbon less using $\\text{Br}_2$ and $\\text{KOH}$ is known as:",
    options: ["Hoffmann bromamide degradation reaction", "Gabriel phthalimide synthesis", "Carbylamine reaction", "Curtius rearrangement"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Nitrogen Containing Organic Compounds",
    difficulty: "easy",
    question_text: "The carbylamine test (isocyanide test) is given exclusively by:",
    options: ["Primary aliphatic and aromatic amines", "Secondary amines only", "Tertiary amines only", "Quaternary ammonium salts"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Oxygen Containing Organic Compound-I",
    difficulty: "medium",
    question_text: "Lucas test is used to distinguish between primary, secondary, and tertiary alcohols. Lucas reagent consists of:",
    options: ["Concentrated $\\text{HCl}$ and anhydrous $\\text{ZnCl}_2$", "Concentrated $\\text{H}_2\\text{SO}_4$ and $\\text{KMnO}_4$", "Bromine water", "Alkaline $\\text{KMnO}_4$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    topic: "Oxygen Containing Organic Compounds-III",
    difficulty: "hard",
    question_text: "The acidic strength of carboxylic acids increases with the presence of electron-withdrawing groups. The correct order of acidity is:",
    options: [
      "$\\text{CF}_3\\text{COOH} > \\text{CCl}_3\\text{COOH} > \\text{CHCl}_2\\text{COOH} > \\text{CH}_3\\text{COOH}$",
      "$\\text{CH}_3\\text{COOH} > \\text{CHCl}_2\\text{COOH} > \\text{CCl}_3\\text{COOH} > \\text{CF}_3\\text{COOH}$",
      "$\\text{CCl}_3\\text{COOH} > \\text{CF}_3\\text{COOH} > \\text{CHCl}_2\\text{COOH} > \\text{CH}_3\\text{COOH}$",
      "$\\text{CF}_3\\text{COOH} > \\text{CH}_3\\text{COOH} > \\text{CHCl}_2\\text{COOH} > \\text{CCl}_3\\text{COOH}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  }
];

// ==========================================
// 50 CHEMISTRY NUMERICAL QUESTIONS (Pure Integers)
// ==========================================
const chemistryNumericals = [
  // --- ATOMIC STRUCTURE & CHEMICAL BONDING (1-10) ---
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "What is the total number of orbitals associated with the principal quantum number $n = 3$?",
    correct_answer: { value: "9" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "easy",
    question_text: "Calculate the total number of radial nodes in a $3p$ orbital.",
    correct_answer: { value: "1" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "How many unpaired electrons are present in the ground state of a gaseous $\\text{Fe}^{3+}$ ion ($Z = 26$)?",
    correct_answer: { value: "5" }
  },
  {
    topic: "Atomic Structure",
    difficulty: "medium",
    question_text: "Calculate the maximum number of electrons in an atom that can have the quantum numbers $n = 4, m_s = +1/2$.",
    correct_answer: { value: "16" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "easy",
    question_text: "Find the total number of lone pairs of electrons on the central xenon atom in $\\text{XeF}_2$.",
    correct_answer: { value: "3" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "Find the total number of lone pairs of electrons in a molecule of $\\text{XeF}_4$ (counting lone pairs on all atoms).",
    correct_answer: { value: "14" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "Calculate the bond order of $\\text{N}_2$ molecule according to molecular orbital theory.",
    correct_answer: { value: "3" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "easy",
    question_text: "Find the number of $\\pi$ bonds present in a molecule of benzene ($\\text{C}_6\\text{H}_6$).",
    correct_answer: { value: "3" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "medium",
    question_text: "How many bridging oxygen atoms are present in a molecule of phosphorus pentoxide ($\\text{P}_4\\text{O}_{10}$)?",
    correct_answer: { value: "6" }
  },
  {
    topic: "Chemical Bonding",
    difficulty: "hard",
    question_text: "Find the number of $\\text{P-O-P}$ bonds present in a molecule of tetraphosphorus decaoxide ($\\text{P}_4\\text{O}_{10}$).",
    correct_answer: { value: "6" }
  },

  // --- STOICHIOMETRY & REDOX (11-18) ---
  {
    topic: "Stoichiometry-I and II",
    difficulty: "medium",
    question_text: "In balancing the redox equation in acidic medium: $a\\text{MnO}_4^{-} + b\\text{C}_2\\text{O}_4^{2-} + c\\text{H}^{+} \\to a\\text{Mn}^{2+} + 2b\\text{CO}_2 + d\\text{H}_2\\text{O}$, what is the value of stoichiometric coefficient $b$ when $a = 2$?",
    correct_answer: { value: "5" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "easy",
    question_text: "Calculate the oxidation state of chromium in potassium dichromate ($\\text{K}_2\\text{Cr}_2\\text{O}_7$).",
    correct_answer: { value: "6" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "medium",
    question_text: "Calculate the oxidation state of sulfur in Caro's acid (peroxomonosulfuric acid, $\\text{H}_2\\text{SO}_5$).",
    correct_answer: { value: "6" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "easy",
    question_text: "What is the oxidation state of iron in the brown ring complex $[\\text{Fe}(\\text{H}_2\\text{O})_5(\\text{NO})]\\text{SO}_4$?",
    correct_answer: { value: "1" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "hard",
    question_text: "How many moles of electrons are involved in the reduction of one mole of $\\text{Cr}_2\\text{O}_7^{2-}$ ions to $\\text{Cr}^{3+}$ in acidic medium?",
    correct_answer: { value: "6" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "medium",
    question_text: "Calculate the number of moles of oxygen gas required for complete combustion of $1\\text{ mole}$ of butane ($\\text{C}_4\\text{H}_{10}$) into $\\text{CO}_2$ and $\\text{H}_2\\text{O}$ multiplied by 2.",
    correct_answer: { value: "13" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "medium",
    question_text: "The equivalent mass of $\\text{KMnO}_4$ in acidic medium is $M/x$. What is the value of integer $x$?",
    correct_answer: { value: "5" }
  },
  {
    topic: "Stoichiometry-I and II",
    difficulty: "easy",
    question_text: "Find the oxidation state of carbon in methane ($\\text{CH}_4$) in terms of its absolute value.",
    correct_answer: { value: "4" }
  },

  // --- THERMODYNAMICS & GASEOUS STATE (19-24) ---
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "For the reaction $2\\text{NO}_2(g) \\rightleftharpoons \\text{N}_2\\text{O}_4(g)$, what is the change in number of gaseous moles $\\Delta n_g$ in absolute value?",
    correct_answer: { value: "1" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "easy",
    question_text: "How many degrees of freedom does a monoatomic ideal gas molecule possess?",
    correct_answer: { value: "3" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "How many translational and rotational degrees of freedom (total) does a rigid non-linear triatomic gas molecule (like $\\text{H}_2\\text{O}$) possess?",
    correct_answer: { value: "6" }
  },
  {
    topic: "Thermodynamics and Thermochemistry",
    difficulty: "medium",
    question_text: "Calculate the value of $C_p - C_v$ for $3\\text{ moles}$ of an ideal gas in units of gas constant $R$.",
    correct_answer: { value: "3" }
  },
  {
    topic: "Solid State",
    difficulty: "easy",
    question_text: "In an FCC (face-centered cubic) unit cell, how many octahedral voids are present per unit cell?",
    correct_answer: { value: "4" }
  },
  {
    topic: "Solid State",
    difficulty: "medium",
    question_text: "In an FCC lattice containing $N$ constituent atoms, what is the total number of tetrahedral voids?",
    correct_answer: { value: "8" }
  },

  // --- EQUILIBRIUM & ELECTROCHEMISTRY (25-32) ---
  {
    topic: "Ionic Equilibrium",
    difficulty: "easy",
    question_text: "The pH of pure neutral water at $25^\\circ\\text{C}$ is:",
    correct_answer: { value: "7" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "medium",
    question_text: "Calculate the pH of a $0.01\\text{ M}$ solution of strong monoprotic acid $\\text{HCl}$.",
    correct_answer: { value: "2" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "medium",
    question_text: "Calculate the pH of a $0.001\\text{ M}$ aqueous solution of strong base $\\text{NaOH}$ at $25^\\circ\\text{C}$.",
    correct_answer: { value: "11" }
  },
  {
    topic: "Ionic Equilibrium",
    difficulty: "hard",
    question_text: "A buffer solution contains equal molar concentrations of weak acid $\\text{HA}$ ($\\text{p}K_a = 5$) and its salt $\\text{NaA}$. What is the pH of this buffer?",
    correct_answer: { value: "5" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "medium",
    question_text: "In the Daniell cell $\\text{Zn}(s)|\\text{Zn}^{2+}(aq)||\\text{Cu}^{2+}(aq)|\\text{Cu}(s)$, how many moles of electrons are transferred per mole of zinc reacted?",
    correct_answer: { value: "2" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "hard",
    question_text: "How many Faradays of electricity are required to deposit $1\\text{ mole}$ of copper from $\\text{CuSO}_4$ solution?",
    correct_answer: { value: "2" }
  },
  {
    topic: "Electrochemistry",
    difficulty: "medium",
    question_text: "How many Faradays of electricity are required to liberate $1\\text{ mole}$ of oxygen gas from water by electrolysis?",
    correct_answer: { value: "4" }
  },
  {
    topic: "Colligative Properties of Solutions",
    difficulty: "easy",
    question_text: "What is the theoretical value of the van 't Hoff factor $i$ for complete ionization of barium chloride ($\\text{BaCl}_2$) in water?",
    correct_answer: { value: "3" }
  },

  // --- CHEMICAL KINETICS (33-38) ---
  {
    topic: "Chemical Kinetics",
    difficulty: "easy",
    question_text: "If the half-life of a first-order reaction is $20\\text{ minutes}$, what is the time required for $75\\%$ completion of the reaction in minutes?",
    correct_answer: { value: "40" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "For a first-order reaction with half-life $t_{1/2} = 10\\text{ min}$, how many half-lives are required for the reaction to reach $87.5\\%$ completion?",
    correct_answer: { value: "3" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "hard",
    question_text: "The rate law for a reaction is $\\text{Rate} = k[A]^2 [B]^1$. What is the overall order of the reaction?",
    correct_answer: { value: "3" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "A reaction has rate law $\\text{Rate} = k[A]^0$. What is the order of this reaction?",
    correct_answer: { value: "0" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "medium",
    question_text: "If the temperature coefficient of a reaction is $2$, by what factor does the reaction rate increase when temperature is raised from $300\\text{ K}$ to $330\\text{ K}$?",
    correct_answer: { value: "8" }
  },
  {
    topic: "Chemical Kinetics",
    difficulty: "easy",
    question_text: "What is the molecularity of the elementary reaction: $\\text{NO} + \\text{O}_3 \\to \\text{NO}_2 + \\text{O}_2$?",
    correct_answer: { value: "2" }
  },

  // --- COORDINATION COMPOUNDS & INORGANIC (39-44) ---
  {
    topic: "Coordination Compounds",
    difficulty: "easy",
    question_text: "Find the oxidation state of cobalt in the coordination complex $[\\text{Co}(\\text{NH}_3)_6]\\text{Cl}_3$.",
    correct_answer: { value: "3" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "What is the coordination number of the central nickel atom in $[\\text{Ni}(\\text{CO})_4]$?",
    correct_answer: { value: "4" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "hard",
    question_text: "Calculate the total number of ions produced in aqueous solution per molecule of $[\\text{Pt}(\\text{NH}_3)_4\\text{Cl}_2]\\text{Cl}_2$.",
    correct_answer: { value: "3" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "How many unpaired electrons are present in the low-spin octahedral complex $[\\text{Co}(\\text{NH}_3)_6]^{3+}$ ($d^6$)?",
    correct_answer: { value: "0" }
  },
  {
    topic: "Coordination Compounds",
    difficulty: "medium",
    question_text: "How many optical isomers are possible for the octahedral coordination complex $[\\text{Co}(\\text{en})_3]^{3+}$?",
    correct_answer: { value: "2" }
  },
  {
    topic: "d-Block Elements",
    difficulty: "easy",
    question_text: "What is the maximum oxidation state shown by manganese ($Z = 25$) in its compounds?",
    correct_answer: { value: "7" }
  },

  // --- ORGANIC CHEMISTRY (45-50) ---
  {
    topic: "Organic Halides and Organic Concepts",
    difficulty: "medium",
    question_text: "Find the total number of structural isomers possible for the alkane having molecular formula $\\text{C}_5\\text{H}_{12}$ (pentane).",
    correct_answer: { value: "3" }
  },
  {
    topic: "Organic Halides and Organic Concepts",
    difficulty: "hard",
    question_text: "How many chiral carbon centers are present in a molecule of 2-bromo-3-chlorobutane?",
    correct_answer: { value: "2" }
  },
  {
    topic: "IOC and Hydrocarbons",
    difficulty: "medium",
    question_text: "How many $\\sigma$ (sigma) bonds are present in a molecule of benzene ($\\text{C}_6\\text{H}_6$)?",
    correct_answer: { value: "12" }
  },
  {
    topic: "IOC and Hydrocarbons",
    difficulty: "easy",
    question_text: "What is the number of $\\pi$ electrons required for aromaticity in benzene according to Huckel's rule ($(4n+2)$ with $n=1$)?",
    correct_answer: { value: "6" }
  },
  {
    topic: "Oxygen Containing Organic Compound-II",
    difficulty: "medium",
    question_text: "In the complete haloform reaction of acetone ($\\text{CH}_3\\text{COCH}_3$) with $\\text{I}_2$ and $\\text{NaOH}$, how many moles of $\\text{I}_2$ are consumed per mole of acetone?",
    correct_answer: { value: "3" }
  },
  {
    topic: "Oxygen Containing Organic Compounds-III",
    difficulty: "easy",
    question_text: "What is the basicity of oxalic acid ($(\\text{COOH})_2$)?",
    correct_answer: { value: "2" }
  }
];

// Shuffle MCQ options so correct answer is distributed evenly across A, B, C, D
function prepareMcq(q) {
  const letters = ['A', 'B', 'C', 'D'];
  const correctText = q.options[q.correct_answer.index];
  
  const perm = [0, 1, 2, 3];
  for (let i = perm.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const newOptions = perm.map(i => q.options[i]);
  const newCorrectIndex = newOptions.indexOf(correctText);
  
  return {
    subject: "Chemistry",
    topic: q.topic,
    subtopic: null,
    difficulty: q.difficulty || "medium",
    q_type: "single_correct",
    question_text: q.question_text,
    image_url: null,
    options: newOptions,
    correct_answer: {
      index: newCorrectIndex,
      letter: letters[newCorrectIndex]
    },
    marks: 4,
    is_active: true,
    review_status: 'approved',
    source: 'manual',
    created_at: new Date().toISOString()
  };
}

function prepareNumerical(q) {
  return {
    subject: "Chemistry",
    topic: q.topic,
    subtopic: null,
    difficulty: q.difficulty || "medium",
    q_type: "numerical",
    question_text: q.question_text,
    image_url: null,
    options: [],
    correct_answer: {
      value: String(q.correct_answer.value)
    },
    marks: 4,
    is_active: true,
    review_status: 'approved',
    source: 'manual',
    created_at: new Date().toISOString()
  };
}

async function insertAll() {
  console.log(`Preparing ${chemistryMcqs.length} Chemistry MCQs...`);
  const finalMcqs = chemistryMcqs.map(prepareMcq);

  console.log(`Preparing ${chemistryNumericals.length} Chemistry Numericals...`);
  const finalNumericals = chemistryNumericals.map(prepareNumerical);

  const allToInsert = [...finalMcqs, ...finalNumericals];
  console.log(`Total questions to insert: ${allToInsert.length}`);

  const batchSize = 25;
  let inserted = 0;
  for (let i = 0; i < allToInsert.length; i += batchSize) {
    const batch = allToInsert.slice(i, i + batchSize);
    const { data, error } = await supabase.from('questions').insert(batch).select('id');
    if (error) {
      console.error('Error in batch %d:', i, error);
      process.exit(1);
    }
    inserted += data.length;
    console.log(`Inserted ${inserted} / ${allToInsert.length}...`);
  }

  console.log(`Successfully added all ${inserted} Chemistry questions (${finalMcqs.length} MCQs + ${finalNumericals.length} Numericals) to Supabase!`);

  // Verify counts
  const { count: mcqCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'Chemistry')
    .eq('q_type', 'single_correct')
    .eq('is_active', true);

  const { count: numCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'Chemistry')
    .eq('q_type', 'numerical')
    .eq('is_active', true);

  console.log(`Current Active Chemistry MCQs in database: ${mcqCount}`);
  console.log(`Current Active Chemistry Numericals in database: ${numCount}`);
}

insertAll();
