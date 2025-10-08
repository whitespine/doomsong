
export const DOOMSONG = {
    // The system id
    id: "doomsong",

    // The keys for various settings
    settings: {
        init: {
            calendar: "init_calendar",
            pdf: "init_pdf",
            combat: "init_combat"
        },
        combat: {
            view_acts: {
                key: "view_acts",
                options: {
                    before_plan: "Before players plan",
                    after_plan: "After players confirm plans",
                    next_act: "Only within the span of an act",
                    never: "Never",
                }
            },
            view_moves: {
                key: "view_actions",
                options: {
                    all_for_act: "All actions for an act will be displayed",
                    on_click_temp: "Actions will be revealed as the Game Master clicks on them, and be visible for this act only",
                    // on_click_perm: "Actions will be revealed as the Game Master clicks on them, and be visible forevermore",
                    never: "Never"
                }

            }
        }
    },

    socket: {
        attack: "UPDATE_ATTACK_FLOW",
        suspense: "SUSPENSE"
    },

    // Keys for combat status flags
    combat: {
        phases: {
            begin: "Round Begins",
            set: "Set Action Dice",
            acts: "Acts",
            retreat: "Retreat",
            end: "End of Round"
        }
    }
}