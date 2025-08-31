
<script>


</script>

<div class="frame">
    <div class="content">
        Hello
    </div>
    
    <div class="top">

    </div>

    <div class="column left">

    </div>

    <div class="column right">

    </div>

    <div class="bottom">

    </div>

</div>


<style lang="scss">
    .frame {
        display: grid;
        grid-template: "t t t" calc(376px / 2)
                       "l n r" 1fr
                       "b b b" calc(681px / 2) / 33px 300px 35px;
        height: 100%;

        .top,.bottom {
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }

        .top {
            background-image: url("systems/doomsong/assets/frames/basic/top_frame.png");
            grid-area: t;
        }

        .column {
            background-image: url("systems/doomsong/assets/frames/basic/vert_border_spacer.png");
            background-size: 100% 100%;
            background-position-x: center;

            &.left {
                margin-left: 8px;
                margin-right: 2px;
                grid-area: l;
            }

            &.right {
                margin-left: 1px;
                margin-right: 10px;
                grid-area: r;
            }
        }

        .bottom {
            background-image: url("systems/doomsong/assets/frames/basic/bottom_frame.png");
            grid-area: b;
        }

        .content {
            grid-column: 1 / 4;
            grid-row: 1 / 4;
            background-color: white;
            margin: 25px 35px;
            padding: 30px 45px;
            max-width: 100%;
        }
    }

</style>