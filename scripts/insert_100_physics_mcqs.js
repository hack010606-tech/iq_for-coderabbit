const crypto = require('crypto');
const { createClient } = require('../backend/node_modules/@supabase/supabase-js');
require('../backend/node_modules/dotenv').config({ path: 'backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const questions = [
  // --- KINEMATICS (1-8) ---
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A particle starts from rest and moves with a uniform acceleration $a$. The distance travelled by it in the $n^{\\text{th}}$ second is given by:",
    options: [
      "$\\frac{a}{2}(2n - 1)$",
      "$\\frac{a}{2}(2n + 1)$",
      "$a(n - 1)$",
      "$\\frac{a}{2}(n^2 - 1)$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "A stone is dropped from a height $h$. It reaches the ground with velocity $v$. If the same stone is dropped from a height $4h$, the velocity with which it strikes the ground will be:",
    options: ["$v$", "$2v$", "$4v$", "$8v$"],
    correct_answer: { index: 1, letter: "B" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A projectile is thrown with initial velocity $u$ at an angle $\\theta$ with the horizontal. The radius of curvature of its trajectory at the highest point is:",
    options: [
      "$\\frac{u^2 \\cos^2\\theta}{g}$",
      "$\\frac{u^2 \\sin^2\\theta}{g}$",
      "$\\frac{u^2}{g}$",
      "$\\frac{u^2 \\cos\\theta}{g}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A body moves in a straight line such that its displacement $x$ at time $t$ is given by $x = 3t^3 - 6t^2 + 4t - 5$. The acceleration of the body when its velocity is zero is:",
    options: ["$2\\sqrt{3}\\text{ m/s}^2$", "$6\\text{ m/s}^2$", "$4\\text{ m/s}^2$", "$0\\text{ m/s}^2$"],
    correct_answer: { index: 1, letter: "B" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A river of width $d$ is flowing with a speed $u$. A swimmer can swim with a speed $v$ relative to water ($v > u$). The minimum time taken by the swimmer to cross the river is:",
    options: [
      "$\\frac{d}{v}$",
      "$\\frac{d}{\\sqrt{v^2 - u^2}}$",
      "$\\frac{d}{v + u}$",
      "$\\frac{d}{\\sqrt{v^2 + u^2}}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A ball is thrown vertically upwards with a velocity of $20\\text{ m/s}$ from the top of a tower of height $25\\text{ m}$. How long will it travel before it hits the ground? (Take $g = 10\\text{ m/s}^2$)",
    options: ["$3\\text{ s}$", "$5\\text{ s}$", "$6\\text{ s}$", "$7\\text{ s}$"],
    correct_answer: { index: 1, letter: "B" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The horizontal range of a projectile is $4\\sqrt{3}$ times its maximum height. The angle of projection $\\theta$ is:",
    options: ["$30^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Kinematics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A car accelerates from rest at a constant rate $\\alpha$ for some time, after which it decelerates at a constant rate $\\beta$ to come to rest. If the total time elapsed is $t$, then the maximum velocity attained by the car is:",
    options: [
      "$\\frac{\\alpha + \\beta}{\\alpha\\beta}t$",
      "$\\frac{\\alpha\\beta}{\\alpha + \\beta}t$",
      "$\\frac{\\alpha^2 + \\beta^2}{\\alpha\\beta}t$",
      "$\\frac{\\alpha\\beta}{\\alpha - \\beta}t$"
    ],
    correct_answer: { index: 1, letter: "B" }
  },

  // --- THE FUNDAMENTAL EQUATION OF DYNAMICS / LAWS OF MOTION (9-16) ---
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A block of mass $m$ is placed on a rough horizontal plane. A horizontal force $F$ is applied to the block. If the coefficient of static friction is $\\mu_s$, the minimum value of $F$ to start the motion of the block is:",
    options: ["$\\mu_s mg$", "$mg / \\mu_s$", "$\\mu_s / mg$", "$\\mu_k mg$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A rocket of initial mass $M_0$ ejects gas with a constant relative exhaust velocity $u$ at a constant rate $\\mu = -dM/dt$. The velocity of the rocket at any time $t$ neglecting gravity is:",
    options: [
      "$u \\ln\\left(\\frac{M_0}{M_0 - \\mu t}\\right)$",
      "$u \\frac{M_0}{M_0 - \\mu t}$",
      "$u \\ln\\left(\\frac{M_0 - \\mu t}{M_0}\\right)$",
      "$\\frac{u}{\\mu t} M_0$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A block of mass $m$ rests on an inclined plane of inclination $\\theta$. The coefficient of friction between the block and the plane is $\\mu = \\tan\\theta$. If the angle of inclination is increased slightly beyond $\\theta$, the acceleration of the block down the incline is:",
    options: ["$g\\sin\\theta$", "$0$", "$g(\\sin\\theta - \\mu\\cos\\theta)$", "$g\\cos\\theta$"],
    correct_answer: { index: 2, letter: "C" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A lift of mass $1000\\text{ kg}$ is moving upwards with an acceleration of $1\\text{ m/s}^2$. The tension in the supporting cable is (take $g = 9.8\\text{ m/s}^2$):",
    options: ["$8800\\text{ N}$", "$9800\\text{ N}$", "$10800\\text{ N}$", "$11800\\text{ N}$"],
    correct_answer: { index: 2, letter: "C" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "A bullet of mass $m$ moving with velocity $v$ hits a wooden block of mass $M$ kept at rest on a frictionless table and gets embedded in it. The velocity of the system after impact is:",
    options: [
      "$\\frac{m}{M + m}v$",
      "$\\frac{M}{M + m}v$",
      "$\\frac{M + m}{m}v$",
      "$\\frac{m}{M}v$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A block of mass $m$ is in contact with the front vertical wall of a cart of mass $M$. The coefficient of static friction between the block and the wall is $\\mu$. The minimum horizontal acceleration of the cart so that the block does not fall is:",
    options: ["$\\mu g$", "$\\frac{g}{\\mu}$", "$\\frac{\\mu}{g}$", "$\\frac{M g}{\\mu m}$"],
    correct_answer: { index: 1, letter: "B" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "Two bodies of masses $m_1$ and $m_2$ ($m_1 > m_2$) are connected by a light inextensible string passing over a smooth massless pulley. The acceleration of the system is:",
    options: [
      "$\\frac{m_1 - m_2}{m_1 + m_2}g$",
      "$\\frac{m_1 + m_2}{m_1 - m_2}g$",
      "$\\frac{2m_1 m_2}{m_1 + m_2}g$",
      "$\\frac{m_1 m_2}{m_1 + m_2}g$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "The Fundamental Equation of Dynamics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "A force $\\vec{F} = (2\\hat{i} + 3\\hat{j} + 4\\hat{k})\\text{ N}$ acts on a body of mass $2\\text{ kg}$ for $2\\text{ s}$. The impulse imparted to the body is:",
    options: [
      "$(4\\hat{i} + 6\\hat{j} + 8\\hat{k})\\text{ N}\\cdot\\text{s}$",
      "$(2\\hat{i} + 3\\hat{j} + 4\\hat{k})\\text{ N}\\cdot\\text{s}$",
      "$(1\\hat{i} + 1.5\\hat{j} + 2\\hat{k})\\text{ N}\\cdot\\text{s}$",
      "$(8\\hat{i} + 12\\hat{j} + 16\\hat{k})\\text{ N}\\cdot\\text{s}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- WORK, POWER AND ENERGY (17-24) ---
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A force $\\vec{F} = (3x^2 \\hat{i} + 2y \\hat{j})\\text{ N}$ acts on a particle. The work done in moving the particle from $(0, 0)$ to $(2, 3)\\text{ m}$ is:",
    options: ["$17\\text{ J}$", "$25\\text{ J}$", "$9\\text{ J}$", "$35\\text{ J}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "If the kinetic energy of a moving body is doubled, its momentum becomes:",
    options: ["$\\sqrt{2}$ times", "2 times", "4 times", "half"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A body of mass $m$ is dropped from a height $h$ onto a vertical spring of force constant $k$ fixed to the ground. The maximum compression $x$ of the spring satisfies the equation:",
    options: [
      "$\\frac{1}{2}kx^2 = mg(h + x)$",
      "$\\frac{1}{2}kx^2 = mgh$",
      "$\\frac{1}{2}kx^2 = mg(h - x)$",
      "$kx = mg(h + x)$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A pump of power $P$ delivers water at a rate of $\\frac{dm}{dt} = \\rho A v$ with a velocity $v$. The power of the pump required to maintain this flow rate is proportional to:",
    options: ["$v$", "$v^2$", "$v^3$", "$v^4$"],
    correct_answer: { index: 2, letter: "C" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The potential energy of a particle in a conservative force field is given by $U(x) = ax^2 - bx$. The equilibrium position of the particle is at $x = $:",
    options: ["$\\frac{b}{2a}$", "$\\frac{a}{2b}$", "$\\frac{b}{a}$", "$\\frac{2b}{a}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A particle of mass $m_1$ moving with velocity $u$ makes an elastic head-on collision with a stationary particle of mass $m_2$. The fraction of kinetic energy transferred to $m_2$ is:",
    options: [
      "$\\frac{4m_1 m_2}{(m_1 + m_2)^2}$",
      "$\\frac{2m_1 m_2}{(m_1 + m_2)^2}$",
      "$\\frac{m_1 m_2}{(m_1 + m_2)^2}$",
      "$\\frac{(m_1 - m_2)^2}{(m_1 + m_2)^2}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "An engine of power $P$ drives a vehicle of mass $m$. The velocity attained by the vehicle as a function of time $t$ (starting from rest) is:",
    options: [
      "$\\sqrt{\\frac{2Pt}{m}}$",
      "$\\frac{Pt}{m}$",
      "$\\sqrt{\\frac{Pt}{2m}}$",
      "$\\frac{2Pt}{m}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Work, Power and Energy",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A vertical spring with force constant $k$ is compressed by an amount $x_0$. A ball of mass $m$ is placed on top of it. When released, the maximum height $H$ reached by the ball above its initial position is:",
    options: [
      "$\\frac{kx_0^2}{2mg}$",
      "$\\frac{kx_0^2}{mg}$",
      "$\\frac{kx_0}{mg}$",
      "$\\frac{2kx_0^2}{mg}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- DYNAMICS OF A SOLID BODY / ROTATIONAL MOTION (25-32) ---
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The moment of inertia of a solid cylinder of mass $M$ and radius $R$ about its geometric axis is:",
    options: ["$\\frac{1}{2}MR^2$", "$MR^2$", "$\\frac{2}{5}MR^2$", "$\\frac{1}{4}MR^2$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A solid sphere rolls down an inclined plane of inclination $\\theta$ without slipping. The acceleration of the center of mass of the sphere is:",
    options: [
      "$\\frac{5}{7}g\\sin\\theta$",
      "$\\frac{2}{3}g\\sin\\theta$",
      "$\\frac{1}{2}g\\sin\\theta$",
      "$g\\sin\\theta$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A thin uniform rod of length $L$ and mass $M$ is hinged at one end and released from horizontal position. The angular acceleration of the rod just after release is:",
    options: [
      "$\\frac{3g}{2L}$",
      "$\\frac{g}{L}$",
      "$\\frac{2g}{3L}$",
      "$\\frac{3g}{L}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A disc of radius $R$ and mass $M$ is rotating with angular velocity $\\omega_0$. Another disc of identical radius and mass at rest is gently placed coaxially on the first disc. The final common angular velocity is:",
    options: ["$\\frac{\\omega_0}{2}$", "$\\frac{\\omega_0}{4}$", "$\\omega_0$", "$2\\omega_0$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The ratio of rotational kinetic energy to the total kinetic energy of a rolling solid sphere without slipping is:",
    options: ["$\\frac{2}{7}$", "$\\frac{5}{7}$", "$\\frac{1}{2}$", "$\\frac{2}{5}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A circular disc of mass $M$ and radius $R$ is rolling without slipping on a horizontal surface with linear velocity $v$. The angular momentum of the disc about the point of contact with the ground is:",
    options: ["$\\frac{3}{2}MRv$", "$MRv$", "$\\frac{1}{2}MRv$", "$2MRv$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The radius of gyration of a uniform disc of radius $R$ about a tangent in its plane is:",
    options: [
      "$\\frac{\\sqrt{5}}{2}R$",
      "$\\frac{R}{2}$",
      "$\\sqrt{\\frac{3}{2}}R$",
      "$\\frac{R}{\\sqrt{2}}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Dynamics of a Solid Body",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A constant torque of $100\\text{ N}\\cdot\\text{m}$ turns a wheel of moment of inertia $20\\text{ kg}\\cdot\\text{m}^2$ about an axis through its center. Its angular velocity after $4\\text{ s}$ starting from rest is:",
    options: ["$20\\text{ rad/s}$", "$40\\text{ rad/s}$", "$10\\text{ rad/s}$", "$80\\text{ rad/s}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- UNIVERSAL GRAVITATION (33-40) ---
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The escape velocity from the surface of the Earth of mass $M$ and radius $R$ is $v_e$. If a planet has twice the mass and twice the radius of Earth, the escape velocity from that planet is:",
    options: ["$v_e$", "$2v_e$", "$\\frac{v_e}{\\sqrt{2}}$", "$\\sqrt{2}v_e$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The acceleration due to gravity $g$ at a depth $d$ below the surface of the Earth of radius $R$ is given by:",
    options: [
      "$g\\left(1 - \\frac{d}{R}\\right)$",
      "$g\\left(1 - \\frac{2d}{R}\\right)$",
      "$g\\left(1 + \\frac{d}{R}\\right)$",
      "$\\frac{g}{\\left(1 + \\frac{d}{R}\\right)^2}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "According to Kepler's third law of planetary motion, the orbital period $T$ of a planet revolving around the Sun at average distance $r$ satisfies:",
    options: ["$T^2 \\propto r^3$", "$T^3 \\propto r^2$", "$T^2 \\propto r^{-3}$", "$T \\propto r^2$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A satellite of mass $m$ is orbiting in a circular orbit of radius $r$ around Earth of mass $M$. The total mechanical energy of the satellite is:",
    options: [
      "$-\\frac{GMm}{2r}$",
      "$-\\frac{GMm}{r}$",
      "$\\frac{GMm}{2r}$",
      "$-2\\frac{GMm}{r}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The height above the surface of the Earth at which the acceleration due to gravity becomes $g/9$ (where $R$ is the Earth's radius) is:",
    options: ["$2R$", "$3R$", "$R/2$", "$8R$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The time period of a geostationary satellite orbiting the Earth is:",
    options: ["$24\\text{ hours}$", "$12\\text{ hours}$", "$365\\text{ days}$", "$84.6\\text{ minutes}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "If the distance between the Earth and the Sun were halved, the duration of one year would be approximately:",
    options: ["$129\\text{ days}$", "$182\\text{ days}$", "$730\\text{ days}$", "$91\\text{ days}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Universal Gravitation",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The gravitational potential at the center of a uniform solid sphere of mass $M$ and radius $R$ is:",
    options: [
      "$-\\frac{3GM}{2R}$",
      "$-\\frac{GM}{R}$",
      "$-\\frac{GM}{2R}$",
      "Zero"
    ],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- PROPERTIES OF MATTER & FLUIDS (41-48) ---
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "According to Hooke's law, within the elastic limit, stress is directly proportional to strain. The ratio of tensile stress to longitudinal strain is known as:",
    options: [
      "Young's modulus",
      "Bulk modulus",
      "Modulus of rigidity",
      "Poisson's ratio"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A spherical raindrop of radius $r$ falls in air of viscosity $\\eta$ and density $\\rho_0$. The terminal velocity $v_t$ of the drop (density $\\rho$) is proportional to:",
    options: ["$r^2$", "$r$", "$r^3$", "$1/r$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The excess pressure inside a spherical soap bubble of radius $R$ with surface tension $T$ in air is:",
    options: ["$\\frac{4T}{R}$", "$\\frac{2T}{R}$", "$\\frac{T}{R}$", "$\\frac{8T}{R}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "In a horizontal pipe carrying an ideal incompressible fluid, the pressure is lowest where:",
    options: [
      "The velocity of fluid is highest",
      "The velocity of fluid is lowest",
      "The cross-sectional area is largest",
      "The density is highest"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "Water rises to a height $h$ in a capillary tube. If the radius of the tube is doubled, the height to which water rises will be:",
    options: ["$\\frac{h}{2}$", "$2h$", "$4h$", "$h$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "Two small drops of mercury each of radius $r$ coalesce to form a single large drop. In this process, the surface energy:",
    options: [
      "Decreases",
      "Increases",
      "Remains constant",
      "Becomes zero"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A wire of length $L$ and cross-sectional area $A$ is stretched by a force $F$ within its elastic limit. The elastic potential energy stored per unit volume of the wire is:",
    options: [
      "$\\frac{1}{2} \\times \\text{stress} \\times \\text{strain}$",
      "$\\text{stress} \\times \\text{strain}$",
      "$\\frac{\\text{stress}}{\\text{strain}}$",
      "$\\frac{1}{2} \\frac{\\text{stress}}{\\text{strain}}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Properties of Matter",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "Bernoulli's theorem is a consequence of the law of conservation of:",
    options: ["Energy", "Linear momentum", "Angular momentum", "Mass"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- THERMODYNAMICS & KTG (49-56) ---
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "During an adiabatic process for an ideal gas with ratio of specific heats $\\gamma = C_p/C_v$, the relation between temperature $T$ and volume $V$ is:",
    options: [
      "$T V^{\\gamma - 1} = \\text{constant}$",
      "$T^{\\gamma} V = \\text{constant}$",
      "$T V^{\\gamma} = \\text{constant}$",
      "$T^{\\gamma - 1} V = \\text{constant}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The efficiency $\\eta$ of a Carnot engine operating between source temperature $T_1$ and sink temperature $T_2$ is:",
    options: [
      "$1 - \\frac{T_2}{T_1}$",
      "$1 - \\frac{T_1}{T_2}$",
      "$\\frac{T_2}{T_1}$",
      "$\\frac{T_1 - T_2}{T_2}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The molar heat capacity at constant volume ($C_v$) of an ideal diatomic gas (without vibrational modes) is:",
    options: ["$\\frac{5}{2}R$", "$\\frac{3}{2}R$", "$\\frac{7}{2}R$", "$3R$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "An ideal gas undergoes an isothermal expansion at temperature $T$ from volume $V_1$ to $V_2$. The work done by $n$ moles of the gas is:",
    options: [
      "$n R T \\ln\\left(\\frac{V_2}{V_1}\\right)$",
      "$n R T \\ln\\left(\\frac{V_1}{V_2}\\right)$",
      "$n R (V_2 - V_1)$",
      "Zero"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "In a cyclic process $ABCA$ shown in a $P$-$V$ diagram, the net work done during the cycle is:",
    options: [
      "Equal to the area enclosed by the cycle $ABCA$",
      "Zero always",
      "Independent of path",
      "Equal to change in internal energy"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The root-mean-square (RMS) speed of gas molecules of molar mass $M$ at absolute temperature $T$ is given by:",
    options: [
      "$\\sqrt{\\frac{3RT}{M}}$",
      "$\\sqrt{\\frac{8RT}{\\pi M}}$",
      "$\\sqrt{\\frac{2RT}{M}}$",
      "$\\sqrt{\\frac{RT}{M}}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "First law of thermodynamics, $\\Delta Q = \\Delta U + \\Delta W$, is essentially an expression of:",
    options: [
      "Conservation of energy",
      "Conservation of heat only",
      "Conservation of momentum",
      "Entropy principle"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "If a gas is compressed adiabatically to $\\frac{1}{8}$ of its initial volume, its temperature increases. If $\\gamma = 5/3$, the ratio of final temperature to initial temperature is:",
    options: ["$4$", "$2$", "$8$", "$16$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- OSCILLATIONS & SHM (57-64) ---
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A particle executes simple harmonic motion with amplitude $A$. At what displacement from the mean position is its kinetic energy equal to its potential energy?",
    options: ["$\\frac{A}{\\sqrt{2}}$", "$\\frac{A}{2}$", "$\\frac{A}{\\sqrt{3}}$", "$\\frac{\\sqrt{3}A}{2}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The time period of a simple pendulum of length $l$ suspended in an elevator accelerating downwards with acceleration $a$ ($a < g$) is:",
    options: [
      "$2\\pi\\sqrt{\\frac{l}{g - a}}$",
      "$2\\pi\\sqrt{\\frac{l}{g + a}}$",
      "$2\\pi\\sqrt{\\frac{l}{g}}$",
      "$2\\pi\\sqrt{\\frac{l}{a}}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A body of mass $m$ attached to a spring of force constant $k$ oscillates with period $T$. If the mass is increased to $4m$, the new time period is:",
    options: ["$2T$", "$4T$", "$T/2$", "$T/4$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "Two simple harmonic motions are represented by $y_1 = 5\\sin(2\\pi t + \\pi/4)$ and $y_2 = 5\\sqrt{2}(\\sin 2\\pi t + \\cos 2\\pi t)$. The ratio of their amplitudes is:",
    options: ["$1 : 2$", "$1 : 1$", "$2 : 1$", "$1 : \\sqrt{2}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "In a simple harmonic oscillator of amplitude $A$ and angular frequency $\\omega$, the maximum acceleration is:",
    options: ["$\\omega^2 A$", "$\\omega A$", "$\\frac{\\omega^2}{A}$", "$\\omega A^2$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The phase difference between the displacement and acceleration of a particle executing simple harmonic motion is:",
    options: ["$\\pi\\text{ rad}$", "$\\pi/2\\text{ rad}$", "Zero", "$2\\pi\\text{ rad}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A spring of stiffness $k$ is cut into two equal halves. The spring constant of each half is:",
    options: ["$2k$", "$k/2$", "$k$", "$4k$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "SHM",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The equation of a plane progressive wave is $y = 0.05\\sin(100t - 2x)$ in SI units. The velocity of the wave is:",
    options: ["$50\\text{ m/s}$", "$100\\text{ m/s}$", "$200\\text{ m/s}$", "$0.05\\text{ m/s}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- ELECTROSTATICS (65-72) ---
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "Two point charges $+q$ and $-q$ are placed at a distance $2a$ apart. The electric potential at any point on the equatorial plane of this electric dipole is:",
    options: ["Zero", "$\\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{a}$", "$\\frac{1}{4\\pi\\varepsilon_0}\\frac{2q}{a^2}$", "Infinite"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The electric flux through a closed Gaussian surface enclosing an electric dipole of dipole moment $p$ is:",
    options: ["Zero", "$\\frac{p}{\\varepsilon_0}$", "$\\frac{2q}{\\varepsilon_0}$", "$\\frac{q}{2\\varepsilon_0}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A parallel plate capacitor with air between the plates has capacitance $C$. If a dielectric slab of dielectric constant $K$ completely fills the space between plates, the new capacitance is:",
    options: ["$KC$", "$C/K$", "$C + K$", "$K^2 C$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "The electric field inside a uniformly charged solid non-conducting sphere of radius $R$ and total charge $Q$ at a distance $r < R$ from its center is proportional to:",
    options: ["$r$", "$1/r^2$", "$r^2$", "$1/r$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The electrostatic energy stored in a capacitor of capacitance $C$ charged to a potential difference $V$ is given by:",
    options: ["$\\frac{1}{2}CV^2$", "$CV^2$", "$\\frac{1}{2}C^2 V$", "$2CV^2$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "Work done in rotating an electric dipole of dipole moment $p$ in a uniform electric field $E$ from angle $\\theta = 0^\\circ$ to $\\theta = 180^\\circ$ is:",
    options: ["$2pE$", "$pE$", "Zero", "$-pE$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The dimensional formula for electric permittivity of free space $\\varepsilon_0$ is:",
    options: [
      "$[M^{-1} L^{-3} T^4 A^2]$",
      "$[M^1 L^3 T^{-4} A^{-2}]$",
      "$[M^{-1} L^2 T^{-2} A^1]$",
      "$[M^1 L^{-3} T^2 A^2]$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electrostatics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A spherical drop of capacitance $1\\text{ }\\mu\\text{F}$ is formed by combining $64$ identical droplets. The capacitance of each droplet was:",
    options: ["$\\frac{1}{4}\\text{ }\\mu\\text{F}$", "$\\frac{1}{16}\\text{ }\\mu\\text{F}$", "$\\frac{1}{64}\\text{ }\\mu\\text{F}$", "$4\\text{ }\\mu\\text{F}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- ELECTRIC CURRENT / CURRENT ELECTRICITY (73-80) ---
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "A copper wire of resistance $R$ is stretched to double its original length keeping volume constant. Its new resistance will be:",
    options: ["$4R$", "$2R$", "$R/2$", "$R/4$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "Kirchhoff's first rule (junction rule) $\\sum I = 0$ is a statement of conservation of:",
    options: ["Electric charge", "Energy", "Momentum", "Angular momentum"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "In a balanced Wheatstone bridge with four arm resistances $P, Q, R, S$, the condition for balance (no galvanometer deflection) is:",
    options: ["$\\frac{P}{Q} = \\frac{R}{S}$", "$P \\cdot R = Q \\cdot S$", "$\\frac{P}{R} = \\frac{S}{Q}$", "$P + Q = R + S$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A cell of emf $E$ and internal resistance $r$ is connected to a variable external resistor $R$. The power delivered to the external resistor is maximum when:",
    options: ["$R = r$", "$R = r/2$", "$R = 2r$", "$R \\to \\infty$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The drift velocity $v_d$ of conduction electrons in a conductor of cross-section $A$ carrying current $I$ (electron density $n$) is:",
    options: [
      "$\\frac{I}{n e A}$",
      "$\\frac{n e A}{I}$",
      "$\\frac{I A}{n e}$",
      "$\\frac{n I}{e A}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The temperature coefficient of resistance is positive for:",
    options: ["Metallic conductors", "Semiconductors", "Carbon resistors", "Electrolytes"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A potentiometer wire of length $10\\text{ m}$ has a resistance of $20\\text{ }\\Omega$. It is connected in series with a resistance of $480\\text{ }\\Omega$ and a battery of $2\\text{ V}$. The potential gradient along the wire is:",
    options: [
      "$8.0 \\times 10^{-4}\\text{ V/cm}$",
      "$4.0 \\times 10^{-3}\\text{ V/cm}$",
      "$2.0 \\times 10^{-4}\\text{ V/cm}$",
      "$1.0 \\times 10^{-3}\\text{ V/cm}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Electric Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "Three resistors of $2\\text{ }\\Omega, 3\\text{ }\\Omega,$ and $6\\text{ }\\Omega$ are connected in parallel. The equivalent resistance of the combination is:",
    options: ["$1\\text{ }\\Omega$", "$11\\text{ }\\Omega$", "$2\\text{ }\\Omega$", "$0.5\\text{ }\\Omega$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- MAGNETIC EFFECTS OF CURRENT & MAGNETISM (81-88) ---
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The magnetic field at the center of a circular current-carrying coil of radius $R$ and $N$ turns carrying current $I$ is:",
    options: [
      "$\\frac{\\mu_0 N I}{2R}$",
      "$\\frac{\\mu_0 N I}{4\\pi R}$",
      "$\\frac{\\mu_0 N I}{2\\pi R}$",
      "$\\frac{\\mu_0 N I}{R^2}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "A charged particle $q$ moves with velocity $\\vec{v}$ in a uniform magnetic field $\\vec{B}$. The magnetic force acting on it is given by:",
    options: ["$q(\\vec{v} \\times \\vec{B})$", "$q(\\vec{v} \\cdot \\vec{B})$", "$q(\\vec{B} \\times \\vec{v})$", "$\\frac{q}{v} \\vec{B}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The radius of circular orbit of a charged particle of mass $m$ and charge $q$ moving perpendicular to a uniform magnetic field $B$ with speed $v$ is:",
    options: ["$\\frac{mv}{qB}$", "$\\frac{qB}{mv}$", "$\\frac{mB}{qv}$", "$\\frac{vB}{qm}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "Two long parallel wires carrying currents $I_1$ and $I_2$ in the same direction separated by distance $d$ will:",
    options: [
      "Attract each other with force per unit length $\\frac{\\mu_0 I_1 I_2}{2\\pi d}$",
      "Repel each other with force per unit length $\\frac{\\mu_0 I_1 I_2}{2\\pi d}$",
      "Attract each other with force per unit length $\\frac{\\mu_0 I_1 I_2}{4\\pi d}$",
      "Experience zero force"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "To convert a moving coil galvanometer of resistance $G$ into an ammeter of range $I$, we must connect:",
    options: [
      "A small resistance in parallel (shunt)",
      "A large resistance in series",
      "A small resistance in series",
      "A large resistance in parallel"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The SI unit of magnetic flux is:",
    options: ["Weber (Wb)", "Tesla (T)", "Henry (H)", "Gauss (G)"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A proton and an $\\alpha$-particle enter a uniform perpendicular magnetic field with the same kinetic energy. The ratio of their radii of curvature $r_p : r_\\alpha$ is:",
    options: ["$1 : 1$", "$1 : 2$", "$2 : 1$", "$1 : 4$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Magnetic Effects of Current",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The magnetic field inside an infinitely long ideal solenoid having $n$ turns per unit length carrying current $I$ is:",
    options: ["$\\mu_0 n I$", "$\\frac{1}{2}\\mu_0 n I$", "$2\\mu_0 n I$", "Zero"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- EMI & AC CIRCUITS (89-94) ---
  {
    subject: "Physics",
    topic: "EMI and AC Circuits",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The induced emf $\\mathcal{E}$ in a closed loop due to changing magnetic flux $\\Phi$ is given by Faraday's law as:",
    options: [
      "$\\mathcal{E} = -\\frac{d\\Phi}{dt}$",
      "$\\mathcal{E} = \\frac{d\\Phi}{dt}$",
      "$\\mathcal{E} = -L\\Phi$",
      "$\\mathcal{E} = -\\int \\Phi dt$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "EMI and AC Circuits",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "Lenz's law of electromagnetic induction is a direct consequence of the law of conservation of:",
    options: ["Energy", "Charge", "Momentum", "Mass"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "EMI and AC Circuits",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "In a series $LCR$ circuit, resonance occurs when the angular frequency $\\omega_0$ of the AC source is:",
    options: [
      "$\\frac{1}{\\sqrt{LC}}$",
      "$\\sqrt{LC}$",
      "$\\frac{L}{C}$",
      "$\\frac{1}{LC}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "EMI and AC Circuits",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "In an AC circuit containing an ideal inductor of inductance $L$, the alternating current lags behind the alternating voltage by a phase angle of:",
    options: ["$\\frac{\\pi}{2}$", "$\\pi$", "Zero", "$\\frac{\\pi}{4}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "EMI and AC Circuits",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The root-mean-square (RMS) value of an alternating current $I = I_0 \\sin(\\omega t)$ over a complete cycle is:",
    options: ["$\\frac{I_0}{\\sqrt{2}}$", "$\\frac{2I_0}{\\pi}$", "$\\sqrt{2}I_0$", "$I_0$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "EMI and AC Circuits",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The power factor of a purely resistive alternating current circuit is:",
    options: ["$1$", "Zero", "$0.5$", "$\\frac{1}{\\sqrt{2}}$"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- RAY OPTICS AND WAVE OPTICS (95-102) ---
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "The critical angle for total internal reflection for a light ray going from a denser medium of refractive index $\\mu$ into air is given by:",
    options: ["$\\sin^{-1}(1/\\mu)$", "$\\cos^{-1}(1/\\mu)$", "$\\tan^{-1}(\\mu)$", "$\\sin^{-1}(\\mu)$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A convex lens of focal length $f$ made of glass ($\\mu = 1.5$) is immersed in water ($\\mu = 4/3$). Its focal length in water becomes:",
    options: ["$4f$", "$2f$", "$f/4$", "$f$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "In Young's double-slit experiment, the fringe width $\\beta$ for light of wavelength $\\lambda$ using slit separation $d$ and screen distance $D$ is:",
    options: ["$\\frac{\\lambda D}{d}$", "$\\frac{\\lambda d}{D}$", "$\\frac{D d}{\\lambda}$", "$\\frac{\\lambda}{D d}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "When an unpolarized light wave is incident on a transparent surface at Brewster's angle $i_p$, the reflected light is:",
    options: [
      "Completely linearly polarized perpendicular to the plane of incidence",
      "Completely linearly polarized parallel to the plane of incidence",
      "Circularly polarized",
      "Unpolarized"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "A thin prism of prism angle $A = 6^\\circ$ made of material with refractive index $\\mu = 1.5$ produces an angle of minimum deviation equal to:",
    options: ["$3^\\circ$", "$6^\\circ$", "$9^\\circ$", "$1.5^\\circ$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "An astronomical telescope has objective of focal length $f_o = 100\\text{ cm}$ and eyepiece of focal length $f_e = 5\\text{ cm}$. In normal adjustment, its magnifying power is:",
    options: ["$20$", "$500$", "$0.05$", "$105$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "If the distance between two coherent sources in YDSE is halved and the screen distance is doubled, the fringe width becomes:",
    options: ["4 times", "2 times", "Halved", "Unchanged"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Ray Optics and Wave Optics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "According to Huygens' principle, each point on a wavefront acts as a source of secondary:",
    options: ["Spherical wavelets", "Plane waves", "Cylindrical waves", "Light particles"],
    correct_answer: { index: 0, letter: "A" }
  },

  // --- MODERN PHYSICS (103-110) ---
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "According to Einstein's photoelectric equation, the maximum kinetic energy $K_{\\max}$ of emitted photoelectrons when light of frequency $\\nu$ falls on a metal of work function $\\phi_0$ is:",
    options: ["$h\\nu - \\phi_0$", "$h\\nu + \\phi_0$", "$\\frac{h\\nu}{\\phi_0}$", "$\\phi_0 - h\\nu$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The de Broglie wavelength $\\lambda$ associated with an electron accelerated from rest through a potential difference $V$ (in volts) is approximately:",
    options: [
      "$\\frac{12.27}{\\sqrt{V}}\\text{ \\AA}$",
      "$\\frac{1.227}{\\sqrt{V}}\\text{ \\AA}$",
      "$\\frac{0.1227}{V}\\text{ \\AA}$",
      "$12.27\\sqrt{V}\\text{ \\AA}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "In Bohr's model of the hydrogen atom, the radius of the $n^{\\text{th}}$ stationary orbit is proportional to:",
    options: ["$n^2$", "$n$", "$1/n$", "$1/n^2$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The half-life of a radioactive substance is $T_{1/2}$. The decay constant $\\lambda$ is related to $T_{1/2}$ by:",
    options: [
      "$\\lambda = \\frac{\\ln 2}{T_{1/2}}$",
      "$\\lambda = \\frac{T_{1/2}}{\\ln 2}$",
      "$\\lambda = T_{1/2} \\ln 2$",
      "$\\lambda = \\frac{1}{T_{1/2}}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "The ratio of minimum wavelength of Lyman series to minimum wavelength of Balmer series in hydrogen spectrum is:",
    options: ["$\\frac{1}{4}$", "$\\frac{1}{9}$", "$4$", "$\\frac{5}{27}$"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "medium",
    q_type: "single_correct",
    question_text: "The nuclear radius $R$ of an atom with mass number $A$ is given by $R = R_0 A^{1/3}$. Therefore, nuclear density is:",
    options: [
      "Independent of mass number $A$",
      "Directly proportional to $A$",
      "Inversely proportional to $A$",
      "Proportional to $A^{1/3}$"
    ],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "easy",
    q_type: "single_correct",
    question_text: "In a nuclear reactor, heavy water ($D_2O$) is commonly used as a:",
    options: ["Moderator to slow down fast neutrons", "Control rod to absorb neutrons", "Fuel", "Shielding material"],
    correct_answer: { index: 0, letter: "A" }
  },
  {
    subject: "Physics",
    topic: "Modern Physics",
    difficulty: "hard",
    q_type: "single_correct",
    question_text: "A radioactive nucleus undergoes a series of decays: emitting $2\\alpha$-particles and $1\\beta^{-}$-particle. If the original nucleus had atomic number $Z$ and mass number $A$, the final nucleus has:",
    options: [
      "Atomic number $Z - 3$, Mass number $A - 8$",
      "Atomic number $Z - 4$, Mass number $A - 8$",
      "Atomic number $Z - 2$, Mass number $A - 4$",
      "Atomic number $Z - 1$, Mass number $A - 6$"
    ],
    correct_answer: { index: 0, letter: "A" }
  }
];

// Shuffle option order so answer isn't always A, but perfectly update correct_answer index & letter!
function shuffleOptions(q) {
  const letters = ['A', 'B', 'C', 'D'];
  const correctText = q.options[q.correct_answer.index];
  
  // Random permutation
  const perm = [0, 1, 2, 3];
  for (let i = perm.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const newOptions = perm.map(i => q.options[i]);
  const newCorrectIndex = newOptions.indexOf(correctText);
  
  return {
    ...q,
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

async function insertAll() {
  console.log(`Preparing ${questions.length} Physics MCQs...`);
  const processed = questions.map(shuffleOptions);

  console.log(`Inserting ${processed.length} questions into Supabase...`);
  // Insert in batches of 25
  const batchSize = 25;
  let inserted = 0;
  for (let i = 0; i < processed.length; i += batchSize) {
    const batch = processed.slice(i, i + batchSize);
    const { data, error } = await supabase.from('questions').insert(batch).select('id');
    if (error) {
      console.error('Error in batch %d:', i, error);
      process.exit(1);
    }
    inserted += data.length;
    console.log(`Inserted ${inserted} / ${processed.length}...`);
  }

  console.log(`Successfully added all ${inserted} Physics MCQs to the database!`);

  // Verify total active single_correct in Physics
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('subject', 'Physics')
    .eq('q_type', 'single_correct')
    .eq('is_active', true);

  console.log(`Total active Physics MCQs in database now: ${count}`);
}

insertAll();
