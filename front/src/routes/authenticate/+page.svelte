<script>
    import "w3-css";
    import '/src/styles.scss';
    import {FORM, PAGE} from "$var";
    import {apiPath, apiUrl, low} from "$lib";
    import R2wxFormGeneric from "$lib/client/component/R2wxFormGeneric.svelte";
    import '/node_modules/font-awesome/css/font-awesome.min.css'
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import {ROLE} from "$var";

</script>

<article>

    <header>
        <img src="/image/logo.png" alt="principle blue logo"/>
    </header>

    <h1>
        R2wx | Road to Webbox
    </h1>

    <section>

        <Wrapper ctx={PAGE.AUTHE} authLevel={ROLE.VISIT}>

            <R2wxFormGeneric
                    mode={FORM.ADD}
                    isEdited={true}
                    ctx={{
                        uri : {post: apiPath("ticket")},
                        blockConfirm: true,
                        redirect: {
                            post: "/"
                   }
               }}/>


        </Wrapper>

    </section>

</article>

<style>
    article {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100vw;
        height: 100vh;
        background: var(--r2wx-color-black);

        header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px auto;
            width: 700px;

            img {
                width: 250px;

                &:last-child {
                    margin-top: 40px;
                    width: 500px;
                }
            }
        }

        h1 {
            text-align: center;
            color: var(--r2wx-color-blue);
            font-size: xxx-large;
        }

        section {
            width: 700px;
            margin: 0 auto;
        }

    }
</style>