import { C } from './palette'

/**
 * Approved personal references, traced as discrete scene assets rather than
 * generic decoration. Their bounds and identity are protected by
 * docs/DESIGN_CONTRACT.md.
 */
export function LockedWallSwordSet() {
  return (
    <g data-reference="wall-sword-set">
      {/* Alhazard: charcoal stepped blade, black/gold guard and red core. */}
      <polygon points="243,64 245,60 249,60 249,56 253,56 253,52 257,52 257,48 261,48 261,44 265,44 266,41 264,39 260,42 259,45 255,45 255,49 251,49 251,53 247,53 247,57 243,57 241,62" fill={C.ink} />
      <polygon points="244,62 247,59 250,59 250,55 254,55 254,51 258,51 258,47 262,47 263,44 261,43 257,46 256,49 252,49 252,53 248,53 248,57 245,57" fill={C.slate} />
      <rect x="250" y="57" width="7" height="1" fill={C.gold} />
      <rect x="252" y="55" width="1" height="6" fill={C.gold} />
      <rect x="255" y="57" width="2" height="2" fill={C.red} />
      <rect x="256" y="56" width="1" height="1" fill={C.goldLight} />
      <rect x="248" y="60" width="2" height="2" fill={C.gold} />
      <rect x="257" y="59" width="2" height="2" fill={C.gold} />
      <rect x="246" y="62" width="2" height="2" fill={C.gold} />

      {/* Langrisser: needle-thin cool silver blade, restrained golden fork hilt. */}
      <polygon points="247,64 249,64 265,31 264,30 263,32 247,62" fill={C.cream} />
      <polygon points="248,62 249,62 264,31 263,33" fill={C.slateLight} />
      <rect x="246" y="62" width="4" height="1" fill={C.gold} />
      <rect x="247" y="63" width="2" height="2" fill={C.gold} />
      <rect x="247" y="65" width="1" height="3" fill={C.ochreDark} />
      <rect x="249" y="64" width="1" height="3" fill={C.gold} />
      <rect x="246" y="64" width="1" height="2" fill={C.gold} />
      <rect x="250" y="61" width="1" height="3" fill={C.gold} />
    </g>
  )
}

export function GranCenturioReference() {
  return (
    <g data-reference="shelf-gran-centurio">
      {/* Thin ring pommel and wrapped grip. */}
      <rect x="293" y="28" width="2" height="2" fill={C.cream} />
      <rect x="292" y="29" width="4" height="1" fill={C.slate} />
      <rect x="293" y="30" width="2" height="5" fill={C.creamDim} />
      <rect x="294" y="30" width="1" height="5" fill={C.slate} />

      {/* Compact teal/gold mechanism immediately below the hilt. */}
      <rect x="290" y="34" width="8" height="2" fill={C.gold} />
      <rect x="291" y="35" width="6" height="3" fill={C.tealDark} />
      <rect x="293" y="35" width="2" height="2" fill={C.tealLight} />
      <rect x="294" y="36" width="1" height="1" fill={C.goldLight} />

      {/* Thin mirrored spiral guard. */}
      <rect x="286" y="35" width="5" height="1" fill={C.creamDim} />
      <rect x="285" y="36" width="2" height="1" fill={C.creamDim} />
      <rect x="284" y="37" width="2" height="2" fill={C.creamDim} />
      <rect x="285" y="39" width="2" height="1" fill={C.creamDim} />
      <rect x="286" y="38" width="1" height="1" fill={C.ink} />
      <rect x="297" y="35" width="5" height="1" fill={C.creamDim} />
      <rect x="302" y="36" width="2" height="1" fill={C.creamDim} />
      <rect x="303" y="37" width="2" height="2" fill={C.creamDim} />
      <rect x="302" y="39" width="2" height="1" fill={C.creamDim} />
      <rect x="302" y="38" width="1" height="1" fill={C.ink} />

      {/* Flat off-white kite blade with a narrow inked ornamental spine. */}
      <polygon points="289,37 299,37 301,40 300,48 297,54 294,57 291,54 288,48 287,40" fill={C.cream} />
      <polygon points="288,39 290,37 289,47 292,54 294,56 291,53 289,47" fill={C.creamDim} />
      <polygon points="294,38 296,39 296,46 295,46 295,49 294,53 293,49 293,46 292,46 292,39" fill={C.ink} />
      <rect x="293" y="39" width="2" height="1" fill={C.slate} />
      <rect x="292" y="41" width="4" height="1" fill={C.ink} />
      <rect x="293" y="42" width="2" height="2" fill={C.creamDim} />
      <rect x="293" y="45" width="2" height="1" fill={C.creamDim} />
      <rect x="294" y="47" width="1" height="3" fill={C.creamDim} />
      <polygon points="294,50 296,53 294,55 292,53" fill={C.ink} />
      <polygon points="294,51 295,53 294,54 293,53" fill={C.slateLight} />
    </g>
  )
}

export function AmbicionReference() {
  return (
    <g data-reference="desk-ambicion">
      {/* Compact pale officer sword: intentionally plain next to the display relics. */}
      <rect x="254" y="102" width="13" height="1" fill={C.cream} />
      <rect x="254" y="103" width="11" height="1" fill={C.creamDim} />
      <rect x="264" y="101" width="1" height="3" fill={C.gold} />
      <rect x="265" y="101" width="3" height="1" fill={C.gold} />
      <rect x="267" y="102" width="3" height="1" fill={C.ink} />
      <rect x="270" y="101" width="1" height="3" fill={C.ochreDark} />
    </g>
  )
}
