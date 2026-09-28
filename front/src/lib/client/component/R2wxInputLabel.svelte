<script>

    import {FORM} from "$var";
    import {form, active} from "$store";

    const _ico = (input) => {
        console.log(" -- INPUT TYPE:: ", input.type)
        return (
            input.type === "text" && 'in-txt')
            || (input.type === "number" && 'in-num')
            || (input.type === "textarea" && 'in-txts')
            || (input.type === "date" && 'fa fa-calendar-o')
            || (input.type === "file" && input.multiple && 'fa fa-files-o')
            || (input.type === "file" && !input.multiple && 'fa fa-file-o')
    }

    let {id} = $props();

    let [disabled, input] = $derived([
        [FORM.READ, FORM.DEL].includes($form.mode),
        $active.form?.[id] || {}
    ])


    const TRAITS = [
        'size',
        'type',
        'step',
        'min',
        'max',
        'required',
        'minlength',
        'maxlength',
        'accept',
    ]
    let alerts = $derived(Object.entries(input).filter(([key, val]) => TRAITS.includes(key)));

</script>

<label for={id} class={disabled ?  "disabled" : ''}>
    <span class="code">
        <code class="wrap r2wx-input-info-{id}">
            <b>&#8505;</b>
            <strong>
            {#each alerts as [key, val] }
                <em class="content">
                    <sub>{String(key)}</sub>
                    <u>{
                        isFinite(String(val))
                            ? new Intl.NumberFormat().format(val)
                            : String(val).replaceAll(",", " ")}
                    </u>
                </em>
                {/each}
            </strong>
        </code>
    </span>
    <code class="literal">
        {input.title}
    </code>
    <span>
        <i class="{_ico(input)}">&nbsp;</i>
    </span>
</label>


<style>
    i {
        color: var(--r2wx-color-blue);

        &.in-txt::after {
            font-size: 12px;
            content: "a,b...";
        }

        &.in-txts::after {
            font-size: 12px;
            content: "a,b,c...";
        }

        &.in-num::after {
            font-size: 12px;
            content: "1,2..";
        }
    }

    .report {
        b, .content {
            color: white;
            background: darkorange !important;
            max-width: 100%;
            overflow: auto;
        }
    }


    label {
        display: flex;
        justify-content: space-between;
        gap: 5px;
        /*color: var(--r2wx-color-blue);*/
        color: #aaa;
        margin: 10px 0;
        text-transform: capitalize;

        &.disabled {
            .code {
                display: none;
            }
        }

        .code {

            b {
                display: inline-block;
                color: white;
                font-size: 10px;
                text-align: center;
                border-radius: 10px;
                background: var(--r2wx-color-black);
                width: 15px;
                cursor: help;
            }


            .wrap {
                display: inline;

                .content {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 10px 2px;
                    border-bottom: 1px solid #bbb;
                }

                &:hover {
                    strong {
                        display: initial;
                    }
                }

                strong {
                    position: absolute;
                    z-index: 15;
                    display: none;
                    width: 280px;
                    background: white;
                    color: var(--r2wx-color-black);

                    u {
                        font-style: normal;
                        text-decoration: none;
                        text-transform: initial;
                    }
                }

            }
        }
    }
</style>
