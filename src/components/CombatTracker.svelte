<script>
    let props = $props();
</script>

<div>
    <header class="combat-tracker-header">
        <nav
            class="encounters flexrow"
            aria-label="Combat Encounters Navigation"
        >
            <span
                class="combat-button combat-create"
                aria-label="Create Encounter"
                role="button"
                data-tooltip="COMBAT.Create"
            >
                <i class="fas fa-plus"></i>
            </span>
            <span
                class="combat-button combat-cycle"
                aria-label="Activate Previous Encounter"
                role="button"
                data-tooltip="COMBAT.EncounterPrevious"
                disabled=""
            >
                <i class="fas fa-caret-left"></i>
            </span>
            <h4 class="encounter">Encounter 1 / 1</h4>
            <span
                class="combat-button combat-cycle"
                aria-label="Activate Next Encounter"
                role="button"
                data-tooltip="COMBAT.EncounterNext"
                disabled=""
            >
                <i class="fas fa-caret-right"></i>
            </span>
            <span
                class="combat-button combat-control"
                aria-label="Delete Encounter"
                role="button"
                data-tooltip="COMBAT.Delete"
                data-control="endCombat"
            >
                <i class="fas fa-trash"></i>
            </span>
        </nav>

        <div class="encounter-controls flexrow combat">
            <h3 class="encounter-title noborder">Not Started</h3>

            <span
                class="combat-button combat-control"
                aria-label="Reset Initiative"
                role="button"
                data-tooltip="COMBAT.InitiativeReset"
                data-control="resetAll"
            >
                <i class="fas fa-undo"></i>
            </span>
            <span
                class="combat-button combat-control"
                aria-label="labels.scope"
                role="button"
                data-tooltip="Unlinked combat, click to link to scene"
                data-control="toggleSceneLink"
            >
                <i class="fas fa-unlink"></i>
            </span>
        </div>
    </header>

    <ol id="combat-tracker" class="directory-list">
        <li
            class="combatant actor directory-item flexrow"
            data-combatant-id="VGUsWUnGpwg4LaiE"
        >
            <img class="token-image" alt="a" src="icons/svg/mystery-man.svg" />
            <div class="token-name flexcol">
                <h4>a</h4>
                <div class="combatant-controls flexrow">
                    <span
                        class="combatant-control"
                        aria-label="Toggle Visibility"
                        role="button"
                        data-tooltip="COMBAT.ToggleVis"
                        data-control="toggleHidden"
                    >
                        <i class="fas fa-eye-slash"></i>
                    </span>
                    <span
                        class="combatant-control"
                        aria-label="Mark Defeated"
                        role="button"
                        data-tooltip="COMBAT.ToggleDead"
                        data-control="toggleDefeated"
                    >
                        <i class="fas fa-skull"></i>
                    </span>
                    <span
                        class="combatant-control"
                        aria-label="Ping Combatant"
                        role="button"
                        data-tooltip="COMBAT.PingCombatant"
                        data-control="pingCombatant"
                    >
                        <i class="fa-solid fa-bullseye-arrow"></i>
                    </span>
                    <div class="token-effects"></div>
                </div>
            </div>

            <div class="token-initiative">
                <span
                    class="combatant-control roll"
                    aria-label="Roll Initiative"
                    role="button"
                    data-tooltip="COMBAT.InitiativeRoll"
                    data-control="rollInitiative"
                ></span>
            </div>
        </li>
    </ol>

    <nav
        id="combat-controls"
        class="directory-footer flexrow"
        data-tooltip-direction="UP"
    >
        <span
            class="combat-control center"
            aria-label="Begin Combat"
            role="button"
            data-control="startCombat">Begin Combat</span
        >
    </nav>
</div>

<style lang="scss">

    .combat-control,.combatant-control {
        cursor: pointer;
    }

    img {
        max-width: 64px;
        max-height: 64px;
    }
</style>