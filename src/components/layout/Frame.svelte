
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
        grid-template: "t t t" 376px 
                       "l n r" 1fr
                       "b b b" 381px / 15px 1fr 15px;
        max-width: 880px;

        > * {
            background-size: cover;
        }

        .top {
            background-image: url("systems/doomsong/assets/frames/basic/top_frame.png");
            grid-area: t;
        }

        .column {
            background-image: url("systems/doomsong/assets/frames/basic/bottom_frame.png");

            &.left {
                grid-area: l;
            }

            &.right {
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
            margin: 70px;
            padding: 30px 45px;
        }
    }

</style>