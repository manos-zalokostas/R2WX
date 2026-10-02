<script>
    import {formPost, formPut, formDel} from "./R2wxFormActions.js";
    import ModalConfirm from "$lib/client/component/ModalConfirm.svelte";
    import SVG from "$lib/client/component/SVG.svelte";
    import {active, form, action} from "$store";
    import {SVGI} from "$lib/SVGIcon.js";
    import {FORM, REQ} from "$var";
    import {ui} from "$store";
    import {goto} from "$app/navigation";

    const LIT_CONFIRM = 'submit'

    const {ctx} = $props()

</script>


{#if [FORM.ADD, FORM.EDIT, FORM.DEL].includes($form.mode)}


    {#if $form.mode === FORM.ADD}
        <button type="button" class="r2wx-shadowable-btn r2wx-add"
                onclick={async ()=>{
                        let res, blocked = false;
                        $ui.confirmBox = 0;
                        $ui.alertBox.status = (REQ.WAIT)
                        let uri =  ctx.uri.post || ctx.uri.all, data;
                        if($action.submit) data = $action.submit();

                        const watcher = setTimeout(() => {

                            blocked = true;
                            if(!(res?.data || res?.error)) $ui.alertBox.status = REQ.BRE
                        }, 3000)

                        res = await formPost({uri, data})
                        clearTimeout(watcher)
                        if(blocked) return;
                        if(res.error) return $ui.alertBox.status = REQ.ERR
                        $ui.alertBox.status =  REQ.OK;
                        if( ctx.redirect?.post) {
                            goto(ctx.redirect.post)
                            $ui.alertBox.status = REQ.OUT
                        }
                }}>
            <strong class="r2wx-nomob">{LIT_CONFIRM}</strong>
            <span><SVG icon={SVGI.FORO} color="greenyellow"/></span>
        </button>
    {/if}


    {#if $form.mode === FORM.EDIT}
        <button type="button" class="r2wx-shadowable-btn"
                onclick={async ()=>{
                    $ui.confirmBox = 0;
                    $ui.alertBox.status = (REQ.WAIT)
                    console.log({ctx})
                    let uri =  ctx.uri.put || ctx.uri.all, data ;
                    if($action.submit) data = $action.submit();
                    const res = await formPut({uri, data, redirect: $action?.redirect?.put})
                    setTimeout(() => {
                        if(res.data) return $ui.alertBox.status = REQ.OK
                        $ui.alertBox.status = REQ.ERR;
                    }, 500)
                }}>
            <strong>
                {LIT_CONFIRM}
            </strong>
            <span>
                    <SVG icon={SVGI.FORO} color="lightblue"/>
                </span>
        </button>
    {/if}


    {#if $form.mode === FORM.DEL}
        <button type="button" class="r2wx-shadowable-btn"
                onclick={async ()=>{
                            $ui.confirmBox = 0;
                            $ui.alertBox.status = (REQ.WAIT)
                            let uri = ctx.uri.del || ctx.uri.all;
                            const res = await formDel( {uri, redirect: $action?.redirect?.del})
                            setTimeout(() => {
                                if(res.data) return $ui.alertBox.status = REQ.OK
                                $ui.alertBox.status = REQ.ERR;
                            }, 500)
                        }}>
            <strong>
                {LIT_CONFIRM}
            </strong>
            <span>
                    <SVG icon={SVGI.FORO}/>
                </span>
        </button>
    {/if}


{/if}